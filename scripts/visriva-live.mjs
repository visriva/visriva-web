#!/usr/bin/env node
/**
 * Visriva Live Edit — local-only visual review overlay for the Next.js dev server.
 * Original implementation. It never writes application source files.
 * Browser changes are stored as proposals in .visriva-live/pending.json for review.
 */
import http from 'node:http';
import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const LIVE_DIR = path.join(ROOT, '.visriva-live');
const QUEUE_FILE = path.join(LIVE_DIR, 'pending.json');
const argv = process.argv.slice(2);
const command = argv[0] || 'help';
const flag = (name, fallback) => {
  const index = argv.indexOf('--' + name);
  return index >= 0 ? argv[index + 1] : fallback;
};

function readQueue() {
  try {
    const parsed = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
    return { version: 1, items: Array.isArray(parsed.items) ? parsed.items : [] };
  } catch {
    return { version: 1, items: [] };
  }
}

function writeQueue(queue) {
  fs.mkdirSync(LIVE_DIR, { recursive: true });
  const temporary = QUEUE_FILE + '.' + process.pid + '.tmp';
  fs.writeFileSync(temporary, JSON.stringify(queue, null, 2) + '\n', { mode: 0o600 });
  fs.renameSync(temporary, QUEUE_FILE);
}

function json(res, status, body) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  });
  res.end(JSON.stringify(body));
}

function readBody(req, maximum = 2_000_000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > maximum) {
        reject(new Error('Request is too large. Save fewer edits at a time.'));
        req.destroy();
      } else chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function buildClient(token) {
  return `(() => {
  if (window.__visrivaLiveEditLoaded) return;
  window.__visrivaLiveEditLoaded = true;
  const TOKEN = ${JSON.stringify(token)};
  const host = document.createElement('div');
  host.id = '__visriva_live_edit_host';
  host.style.cssText = 'all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none';
  document.documentElement.appendChild(host);
  const root = host.attachShadow({mode:'open'});
  root.innerHTML = `
    <style>
      *{box-sizing:border-box;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
      .panel{position:fixed;top:14px;right:14px;display:flex;align-items:center;gap:6px;padding:8px;background:#102b20;color:#f8f2e5;border:1px solid #b99a58;border-radius:12px;box-shadow:0 8px 30px #0005;pointer-events:auto;font-size:12px}
      button{border:1px solid #627568;border-radius:7px;background:#183a2b;color:#fff;padding:7px 10px;font-size:12px;cursor:pointer}
      button.primary{background:#b99a58;color:#102016;border-color:#b99a58;font-weight:700}
      button.danger{border-color:#a55b50;color:#ffd9d2}
      button.active{background:#e8d7ac;color:#102016}
      button:disabled{opacity:.45;cursor:not-allowed}
      #count{color:#e4d3a8;min-width:54px;text-align:center}
      #status{position:fixed;right:16px;top:66px;max-width:340px;background:#102b20;color:#f8f2e5;border:1px solid #6f8c76;padding:8px 12px;border-radius:8px;font-size:12px;display:none;pointer-events:none}
      #help{position:fixed;right:16px;top:108px;max-width:300px;background:#102016ed;color:#e9e2d1;border:1px solid #566c5e;padding:10px 12px;border-radius:8px;font-size:12px;line-height:1.5;display:none;pointer-events:none}
    </style>
    <div class="panel" role="toolbar" aria-label="Visriva visual editor">
      <strong style="color:#e2c98b;letter-spacing:.08em">VISRIVA EDIT</strong>
      <button id="toggle" class="active">Select: on</button>
      <button id="edit" disabled>Edit text</button>
      <button id="duplicate" disabled>Duplicate</button>
      <button id="delete" class="danger" disabled>Delete</button>
      <span id="count">0 edits</span>
      <button id="save" class="primary">Save draft</button>
      <button id="helpBtn">?</button>
      <button id="close">Close</button>
    </div>
    <div id="status"></div>
    <div id="help">Click an element on the page to select it. Use <b>Edit text</b> to preview a text change, or Duplicate/Delete to queue a structural proposal. <b>Save draft</b> stores proposals locally; it does not change source code or the live website.</div>
  `;
  const $ = id => root.getElementById(id);
  const toggle = $('toggle'), edit = $('edit'), duplicate = $('duplicate'), remove = $('delete');
  const count = $('count'), status = $('status'), help = $('help');
  let enabled = true, selected = null, editing = null, edits = [];
  const ignored = new Set(['HTML','BODY','HEAD','SCRIPT','STYLE','NOSCRIPT','SVG','PATH','META','LINK']);

  function usefulElement(node) {
    if (!(node instanceof HTMLElement) || node.closest('#__visriva_live_edit_host')) return false;
    if (ignored.has(node.tagName) || node.isContentEditable || node.closest('input,textarea,select,[contenteditable="true"]')) return false;
    const text = (node.innerText || '').trim();
    return text.length > 0 && text.length < 5000;
  }
  function bestTarget(node) {
    let current = node instanceof Element ? node : node && node.parentElement;
    while (current && current !== document.body) {
      if (usefulElement(current)) {
        const childHasText = Array.from(current.children).some(child => (child.innerText || '').trim().length > 0);
        if (!childHasText || current.children.length > 5) return current;
      }
      current = current.parentElement;
    }
    return node instanceof HTMLElement && usefulElement(node) ? node : null;
  }
  function selectorFor(element) {
    if (element.id) {
      const escaped = CSS.escape(element.id);
      if (document.querySelectorAll('#' + escaped).length === 1) return '#' + escaped;
    }
    const parts = [];
    let node = element;
    while (node && node !== document.body && parts.length < 8) {
      const tag = node.tagName.toLowerCase();
      let index = 1;
      for (let sibling = node.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
        if (sibling.tagName === node.tagName) index++;
      }
      parts.unshift(tag + ':nth-of-type(' + index + ')');
      node = node.parentElement;
    }
    return 'body > ' + parts.join(' > ');
  }
  function show(message, isError = false) {
    status.textContent = message;
    status.style.borderColor = isError ? '#b95f53' : '#6f8c76';
    status.style.display = 'block';
    clearTimeout(show.timer);
    show.timer = setTimeout(() => status.style.display = 'none', 4200);
  }
  function refresh() {
    count.textContent = edits.length + (edits.length === 1 ? ' edit' : ' edits');
    edit.disabled = !selected || !!editing;
    duplicate.disabled = !selected || !!editing;
    remove.disabled = !selected || !!editing;
  }
  function clearSelection() {
    if (selected) selected.style.outline = selected.dataset.visrivaOldOutline || '';
    if (selected) selected.style.outlineOffset = selected.dataset.visrivaOldOutlineOffset || '';
    selected = null;
    refresh();
  }
  function select(element) {
    if (!usefulElement(element)) return;
    if (selected && selected !== element) clearSelection();
    selected = element;
    if (selected.dataset.visrivaOldOutline === undefined) {
      selected.dataset.visrivaOldOutline = selected.style.outline;
      selected.dataset.visrivaOldOutlineOffset = selected.style.outlineOffset;
    }
    selected.style.outline = '2px solid #d2ae62';
    selected.style.outlineOffset = '2px';
    refresh();
  }
  function remember(item) {
    const previous = edits.findIndex(entry => entry.type === 'text' && entry.selector === item.selector);
    if (item.type === 'text' && previous >= 0) edits.splice(previous, 1);
    edits.push(item);
    refresh();
  }

  document.addEventListener('click', event => {
    if (!enabled || event.composedPath().includes(host)) return;
    const target = bestTarget(event.target);
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    select(target);
  }, true);

  toggle.addEventListener('click', () => {
    enabled = !enabled;
    toggle.textContent = 'Select: ' + (enabled ? 'on' : 'off');
    toggle.classList.toggle('active', enabled);
    if (!enabled) clearSelection();
  });
  edit.addEventListener('click', () => {
    if (!selected || editing) return;
    editing = selected;
    editing.dataset.visrivaOriginalText = editing.innerText;
    editing.contentEditable = 'true';
    editing.spellcheck = true;
    editing.style.outline = '2px dashed #d2ae62';
    editing.focus();
    show('Edit the text on the page, then click Save draft.');
  });
  document.addEventListener('focusout', event => {
    if (!editing || event.target !== editing) return;
    const element = editing;
    const before = element.dataset.visrivaOriginalText || '';
    const after = element.innerText || '';
    element.contentEditable = 'false';
    delete element.dataset.visrivaOriginalText;
    editing = null;
    if (before !== after) {
      remember({type:'text',page:location.pathname,selector:selectorFor(element),oldText:before.slice(0,5000),newText:after.slice(0,5000),html:element.outerHTML.slice(0,3000)});
      show('Text edit added to local draft.');
    }
    if (selected) selected.style.outline = '2px solid #d2ae62';
    refresh();
  }, true);
  duplicate.addEventListener('click', () => {
    if (!selected || editing) return;
    remember({type:'duplicate',page:location.pathname,selector:selectorFor(selected),text:(selected.innerText || '').slice(0,1000),html:selected.outerHTML.slice(0,3000)});
    const clone = selected.cloneNode(true);
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    selected.parentElement && selected.parentElement.insertBefore(clone, selected.nextSibling);
    clearSelection();
    show('Duplicate preview added. Save draft to queue it for code review.');
  });
  remove.addEventListener('click', () => {
    if (!selected || editing) return;
    const target = selected;
    remember({type:'delete',page:location.pathname,selector:selectorFor(target),text:(target.innerText || '').slice(0,1000),html:target.outerHTML.slice(0,3000)});
    clearSelection();
    target.remove();
    show('Delete preview added. Save draft to queue it for code review.');
  });
  $('helpBtn').addEventListener('click', () => help.style.display = help.style.display === 'block' ? 'none' : 'block');
  $('close').addEventListener('click', () => { host.remove(); window.__visrivaLiveEditLoaded = false; });
  $('save').addEventListener('click', async () => {
    if (editing) editing.blur();
    if (!edits.length) { show('No changes to save.'); return; }
    const saveButton = $('save');
    saveButton.disabled = true;
    try {
      const response = await fetch('/__visriva-live/save', {
        method:'POST',
        headers:{'content-type':'application/json','x-visriva-live-token':TOKEN},
        body:JSON.stringify({items:edits})
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Could not save local draft.');
      edits = [];
      refresh();
      show('Saved ' + body.saved + ' proposal(s) to .visriva-live/pending.json. Application code is unchanged.');
    } catch (error) {
      show(error.message || 'Save failed.', true);
    } finally {
      saveButton.disabled = false;
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && editing) {
      editing.innerText = editing.dataset.visrivaOriginalText || editing.innerText;
      editing.contentEditable = 'false';
      delete editing.dataset.visrivaOriginalText;
      editing = null;
      show('Text edit cancelled.');
      refresh();
    }
  });
  refresh();
})();`;
}

function validateLocalTarget(value) {
  const target = new URL(value);
  const loopback = ['localhost','127.0.0.1','::1','[::1]'].includes(target.hostname);
  if (target.protocol !== 'http:' || !loopback) {
    throw new Error('For safety, Visriva Live Edit only proxies a local HTTP dev server (localhost or 127.0.0.1).');
  }
  return target;
}

async function detectTarget(excludedPort) {
  for (const port of [3000, 3001, 3002, 5173, 5174, 8080]) {
    if (port === excludedPort) continue;
    const available = await new Promise(resolve => {
      const request = http.get({hostname:'127.0.0.1',port,path:'/',timeout:700}, response => {
        response.resume();
        resolve(true);
      });
      request.on('error', () => resolve(false));
      request.on('timeout', () => { request.destroy(); resolve(false); });
    });
    if (available) return 'http://127.0.0.1:' + port;
  }
  return null;
}

async function start() {
  const port = Number(flag('port', 4321));
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Choose a valid local port between 1024 and 65535.');
  const targetValue = flag('target') || await detectTarget(port);
  if (!targetValue) throw new Error('No local dev server found. Start npm run dev first, or pass --target http://127.0.0.1:3000.');
  const target = validateLocalTarget(targetValue);
  const token = crypto.randomBytes(24).toString('hex');
  const clientJs = buildClient(token);

  const server = http.createServer(async (req, res) => {
    if (req.url && req.url.startsWith('/__visriva-live/')) {
      try {
        if (req.url === '/__visriva-live/client.js' && req.method === 'GET') {
          res.writeHead(200, {'content-type':'text/javascript; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});
          res.end(clientJs);
          return;
        }
        if (req.url === '/__visriva-live/save' && req.method === 'POST') {
          if (req.headers['x-visriva-live-token'] !== token) return json(res, 403, {error:'Invalid local editor session.'});
          const body = JSON.parse(await readBody(req));
          if (!Array.isArray(body.items) || body.items.length > 100) return json(res, 400, {error:'Send between 1 and 100 edit proposals.'});
          const queue = readQueue();
          const accepted = body.items.filter(item => item && ['text','duplicate','delete'].includes(item.type)).map(item => ({
            id: crypto.randomBytes(4).toString('hex'),
            type: item.type,
            page: String(item.page || '/').slice(0,300),
            selector: String(item.selector || '').slice(0,1000),
            oldText: String(item.oldText || '').slice(0,5000),
            newText: String(item.newText || '').slice(0,5000),
            text: String(item.text || '').slice(0,1000),
            html: String(item.html || '').slice(0,3000),
            createdAt: new Date().toISOString(),
            status: 'pending'
          }));
          if (!accepted.length) return json(res, 400, {error:'No valid edit proposals were provided.'});
          queue.items.push(...accepted);
          writeQueue(queue);
          return json(res, 200, {saved:accepted.length});
        }
        return json(res, 404, {error:'Not found.'});
      } catch (error) {
        return json(res, 400, {error:error.message || 'Invalid request.'});
      }
    }

    const headers = {...req.headers,host:target.host,'accept-encoding':'identity'};
    delete headers['x-visriva-live-token'];
    const proxy = http.request({
      hostname:target.hostname,
      port:Number(target.port || 80),
      path:req.url,
      method:req.method,
      headers
    }, upstream => {
      const contentType = upstream.headers['content-type'] || '';
      if (contentType.includes('text/html') && req.method !== 'HEAD') {
        const chunks = [];
        upstream.on('data', chunk => chunks.push(chunk));
        upstream.on('end', () => {
          let html = Buffer.concat(chunks).toString('utf8');
          const injection = '<script src="/__visriva-live/client.js" defer></script>';
          html = /<\\/body>/i.test(html) ? html.replace(/<\\/body>/i, injection + '</body>') : html + injection;
          const responseHeaders = {...upstream.headers};
          delete responseHeaders['content-length'];
          delete responseHeaders['content-encoding'];
          res.writeHead(upstream.statusCode || 200, responseHeaders);
          res.end(html);
        });
      } else {
        res.writeHead(upstream.statusCode || 502, upstream.headers);
        upstream.pipe(res);
      }
    });
    proxy.on('error', error => {
      if (!res.headersSent) res.writeHead(502, {'content-type':'text/plain; charset=utf-8'});
      res.end('Visriva Live Edit cannot reach ' + target.origin + ': ' + error.message);
    });
    req.pipe(proxy);
  });

  server.on('upgrade', (req, socket, head) => {
    const upstream = net.connect(Number(target.port || 80), target.hostname, () => {
      const lines = Object.entries(req.headers).map(([key,value]) => key + ': ' + (key === 'host' ? target.host : value));
      upstream.write(req.method + ' ' + req.url + ' HTTP/1.1\\r\\n' + lines.join('\\r\\n') + '\\r\\n\\r\\n');
      if (head && head.length) upstream.write(head);
      socket.pipe(upstream).pipe(socket);
    });
    upstream.on('error', () => socket.destroy());
    socket.on('error', () => upstream.destroy());
  });

  server.listen(port, '127.0.0.1', () => {
    fs.mkdirSync(LIVE_DIR, {recursive:true});
    console.log('\\nVisriva Live Edit is ready');
    console.log('Open: http://127.0.0.1:' + port);
    console.log('Proxy target: ' + target.origin);
    console.log('Draft queue: ' + path.relative(ROOT, QUEUE_FILE));
    console.log('Local-only: bound to 127.0.0.1; no application source files are written.\\n');
  });
}

function showPending() {
  const queue = readQueue();
  if (!queue.items.length) { console.log('No pending visual edit proposals.'); return; }
  for (const item of queue.items) {
    console.log('[' + item.id + '] ' + item.type.toUpperCase() + ' page=' + item.page + ' selector=' + item.selector);
    if (item.type === 'text') console.log('  ' + JSON.stringify(item.oldText) + ' -> ' + JSON.stringify(item.newText));
    else console.log('  ' + (item.text || '(no text)'));
  }
}

function markDone() {
  const ids = argv.slice(1).filter(value => !value.startsWith('--'));
  const queue = readQueue();
  const before = queue.items.length;
  queue.items = ids.length ? queue.items.filter(item => !ids.includes(item.id)) : [];
  writeQueue(queue);
  console.log('Removed ' + (before - queue.items.length) + ' proposal(s); ' + queue.items.length + ' remain.');
}

try {
  if (command === 'start') await start();
  else if (command === 'pending') showPending();
  else if (command === 'done') markDone();
  else {
    console.log('Visriva Live Edit');
    console.log('  npm run dev');
    console.log('  npm run live');
    console.log('  npm run live:pending');
    console.log('  npm run live:done -- <id>');
  }
} catch (error) {
  console.error('Visriva Live Edit: ' + (error.message || error));
  process.exitCode = 1;
}
