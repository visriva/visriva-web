import type { StudioImagePatch, StudioNodeOverride, StudioPageState, StudioStylePatch } from "@/lib/studio-types";

export const STUDIO_EDITABLE_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "span",
  "a",
  "button",
  "label",
  "li",
  "img",
  "video",
  "svg",
  "section",
  "article",
  "form",
  "[data-section]",
  "div[data-studio-block]",
].join(",");

const SKIP_ANCESTOR = "[data-studio-ui]";
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME"]);

export function resolveStudioPageKey(pathname: string): import("@/lib/studio-types").StudioPageKey {
  if (pathname.startsWith("/qr")) return "qr";
  if (pathname.startsWith("/reviews") || pathname === "/review") return "reviews";
  if (
    pathname.startsWith("/photo-booths") ||
    pathname.startsWith("/ai-merchandise") ||
    pathname.startsWith("/games-vr") ||
    pathname.startsWith("/services")
  ) {
    return "services";
  }
  return "home";
}

export function elementStudioId(el: Element): string {
  const existing = el.getAttribute("data-studio-id");
  if (existing) return existing;
  const path: string[] = [];
  let node: Element | null = el;
  const root = document.getElementById("content") ?? document.body;
  while (node && node !== root) {
    const parent: Element | null = node.parentElement;
    if (!parent) break;
    const idx = Array.from(parent.children).indexOf(node);
    path.unshift(`${node.tagName.toLowerCase()}:${idx}`);
    node = parent;
  }
  return path.join("/") || "root";
}

export function describeElement(el: Element): { tag: string; label: string; kind: string } {
  const tag = el.tagName.toLowerCase();
  const text = (el.textContent ?? "").trim().slice(0, 48);
  const label = text || tag;
  let kind = tag;
  if (tag === "img" || tag === "video") kind = "Image";
  else if (tag === "section" || tag === "article" || el.hasAttribute("data-section")) kind = "Section";
  else if (tag === "button" || (tag === "a" && el.classList.contains("liquid-button"))) kind = "Button";
  else if (/^h[1-6]$/.test(tag)) kind = "Heading";
  else if (tag === "p") kind = "Paragraph";
  return { tag, label, kind };
}

export function isStudioEditableTarget(el: Element | null): el is HTMLElement {
  if (!el || !(el instanceof HTMLElement)) return false;
  if (SKIP_TAGS.has(el.tagName)) return false;
  if (el.closest(SKIP_ANCESTOR)) return false;
  if (el.closest("[data-studio-id]") === el && el.hasAttribute("data-studio-skip")) return false;
  return el.matches(STUDIO_EDITABLE_SELECTOR) || Boolean(el.querySelector(STUDIO_EDITABLE_SELECTOR));
}

export function findEditableAtPoint(x: number, y: number, root: HTMLElement): HTMLElement | null {
  const stack = document.elementsFromPoint(x, y) as HTMLElement[];
  for (const el of stack) {
    if (!root.contains(el)) continue;
    if (el.closest(SKIP_ANCESTOR)) continue;
    if (el.matches(STUDIO_EDITABLE_SELECTOR)) return el;
    const match = el.closest(STUDIO_EDITABLE_SELECTOR);
    if (match && root.contains(match)) return match as HTMLElement;
  }
  return null;
}

export function applyStylePatch(el: HTMLElement, patch: StudioStylePatch) {
  const map: [keyof StudioStylePatch, string][] = [
    ["fontFamily", "fontFamily"],
    ["fontWeight", "fontWeight"],
    ["fontSize", "fontSize"],
    ["lineHeight", "lineHeight"],
    ["letterSpacing", "letterSpacing"],
    ["textAlign", "textAlign"],
    ["color", "color"],
    ["paddingTop", "paddingTop"],
    ["paddingRight", "paddingRight"],
    ["paddingBottom", "paddingBottom"],
    ["paddingLeft", "paddingLeft"],
    ["marginTop", "marginTop"],
    ["marginRight", "marginRight"],
    ["marginBottom", "marginBottom"],
    ["marginLeft", "marginLeft"],
    ["background", "background"],
    ["borderColor", "borderColor"],
    ["borderWidth", "borderWidth"],
    ["borderRadius", "borderRadius"],
    ["boxShadow", "boxShadow"],
    ["width", "width"],
    ["height", "height"],
    ["objectFit", "objectFit"],
    ["objectPosition", "objectPosition"],
    ["transform", "transform"],
    ["display", "display"],
  ];
  for (const [key, cssKey] of map) {
    const v = patch[key];
    if (v !== undefined) el.style.setProperty(cssKey, v);
  }
  if (patch.backdropBlur !== undefined) {
    el.style.setProperty("backdrop-filter", `blur(${patch.backdropBlur})`);
  }
}

export function applyNodeOverride(el: HTMLElement, override: StudioNodeOverride | undefined, breakpoint: "desktop" | "mobile") {
  if (!override) return;
  if (override.deleted || override.hidden) {
    el.style.display = "none";
    return;
  }
  el.style.display = "";
  if (override.text !== undefined && !["img", "video", "input"].includes(el.tagName.toLowerCase())) {
    el.textContent = override.text;
  }
  if (override.href !== undefined && el instanceof HTMLAnchorElement) {
    el.href = override.href;
    if (override.targetBlank) el.target = "_blank";
    else el.removeAttribute("target");
  }
  const styles = override.styles?.[breakpoint];
  if (styles) applyStylePatch(el, styles);
  if (override.image?.url && el instanceof HTMLImageElement) {
    el.src = override.image.url;
    if (override.image.alt) el.alt = override.image.alt;
    if (override.image.objectFit) el.style.objectFit = override.image.objectFit;
    if (override.image.zoom) el.style.transform = `scale(${override.image.zoom})`;
    if (override.image.focalX !== undefined || override.image.focalY !== undefined) {
      el.style.objectPosition = `${override.image.focalX ?? 50}% ${override.image.focalY ?? 50}%`;
    }
  }
}

export function hydrateStudioIds(root: HTMLElement) {
  const nodes = root.querySelectorAll(STUDIO_EDITABLE_SELECTOR);
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
  if (node.closest(SKIP_ANCESTOR)) return;
    const id = elementStudioId(node);
    node.setAttribute("data-studio-id", id);
    const { tag, label } = describeElement(node);
    node.setAttribute("data-studio-tag", tag);
    node.setAttribute("data-studio-label", label);
  });
}

export function buildLayerTree(root: HTMLElement): import("@/lib/studio-types").StudioLayerNode[] {
  const sections = Array.from(root.querySelectorAll(":scope > section, :scope > article, :scope > div[data-section], :scope > main > section"));
  const top = sections.length ? sections : [root];
  function walk(el: Element, depth: number): import("@/lib/studio-types").StudioLayerNode {
    const studioId = el.getAttribute("data-studio-id") ?? elementStudioId(el);
    const { label, tag } = describeElement(el);
    const rect = el instanceof HTMLElement ? el.getBoundingClientRect() : undefined;
    const childEls = Array.from(el.children).filter(
      (c) => c.matches(STUDIO_EDITABLE_SELECTOR) || c.querySelector(STUDIO_EDITABLE_SELECTOR),
    );
    return {
      studioId,
      tag,
      label,
      depth,
      rect: rect ? { width: Math.round(rect.width), height: Math.round(rect.height) } : undefined,
      children: childEls.slice(0, 40).map((c) => walk(c, depth + 1)),
    };
  }
  return top.map((el) => walk(el, 0));
}

export function mergeOverride(
  overrides: Record<string, StudioNodeOverride>,
  patch: Partial<StudioNodeOverride> & { studioId: string },
): Record<string, StudioNodeOverride> {
  const prev = overrides[patch.studioId];
  const next: StudioNodeOverride = {
    studioId: patch.studioId,
    tag: patch.tag ?? prev?.tag ?? "div",
    label: patch.label ?? prev?.label,
    hidden: patch.hidden ?? prev?.hidden,
    deleted: patch.deleted ?? prev?.deleted,
    text: patch.text ?? prev?.text,
    href: patch.href ?? prev?.href,
    targetBlank: patch.targetBlank ?? prev?.targetBlank,
    buttonStyle: patch.buttonStyle ?? prev?.buttonStyle,
    styles: patch.styles
      ? {
          desktop: { ...prev?.styles?.desktop, ...patch.styles.desktop },
          mobile: { ...prev?.styles?.mobile, ...patch.styles.mobile },
        }
      : prev?.styles,
    image: patch.image ? { ...prev?.image, ...patch.image } : prev?.image,
  };
  return { ...overrides, [patch.studioId]: next };
}

export function applyPublishedState(root: HTMLElement, state: StudioPageState, bp: "desktop" | "mobile") {
  hydrateStudioIds(root);
  Object.values(state.overrides).forEach((ov) => {
    const el = root.querySelector(`[data-studio-id="${CSS.escape(ov.studioId)}"]`);
    if (el instanceof HTMLElement) applyNodeOverride(el, ov, bp);
  });
  state.insertedBlocks.forEach((block) => {
    if (root.querySelector(`[data-studio-block="${block.id}"]`)) return;
    const wrap = document.createElement("section");
    wrap.setAttribute("data-studio-block", block.id);
    wrap.setAttribute("data-studio-id", `block/${block.id}`);
    wrap.className = "studio-inserted-block border border-[#C9A227]/30 bg-[#07261C]/20 p-6 my-6 rounded-2xl";
    wrap.innerHTML = block.html ?? `<p class="text-[#DCE8DF]">${block.kind}</p>`;
    root.appendChild(wrap);
  });
}

export function imageMeta(el: HTMLImageElement): StudioImagePatch {
  return {
    url: el.currentSrc || el.src,
    alt: el.alt,
    naturalWidth: el.naturalWidth,
    naturalHeight: el.naturalHeight,
  };
}