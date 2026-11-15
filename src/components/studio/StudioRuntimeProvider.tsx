"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  applyNodeOverride,
  applyPublishedState,
  buildLayerTree,
  describeElement,
  elementStudioId,
  findEditableAtPoint,
  hydrateStudioIds,
  imageMeta,
  mergeOverride,
  resolveStudioPageKey,
} from "@/lib/studio-dom";
import {
  EMPTY_STUDIO_PAGE_STATE,
  STUDIO_PAGES,
  STUDIO_STORAGE_DRAFT,
  STUDIO_STORAGE_EDITOR,
  type StudioLayerNode,
  type StudioNodeOverride,
  type StudioPageState,
  type StudioViewport,
  type StudioSnapshot,
} from "@/lib/studio-types";

const HISTORY_CAP = 50;

type History = { past: StudioPageState[]; present: StudioPageState; future: StudioPageState[] };

type StudioCtx = {
  pageKey: ReturnType<typeof resolveStudioPageKey>;
  isAdmin: boolean;
  isStudioMode: boolean;
  xRay: boolean;
  gridGuides: boolean;
  viewport: StudioViewport;
  zoom: number;
  state: StudioPageState;
  layers: StudioLayerNode[];
  hoverTarget: StudioNodeOverride | null;
  hoverRect: DOMRect | null;
  selectedId: string | null;
  hoverEl: HTMLElement | null;
  selectedEl: HTMLElement | null;
  selectedOverride: StudioNodeOverride | null;
  canUndo: boolean;
  canRedo: boolean;
  publishing: boolean;
  saving: boolean;
  setViewport: (v: StudioViewport) => void;
  setZoom: (z: number) => void;
  setXRay: (v: boolean) => void;
  setGridGuides: (v: boolean) => void;
  selectById: (id: string | null) => void;
  patchOverride: (patch: Partial<StudioNodeOverride> & { studioId: string; tag?: string }) => void;
  deleteSelected: () => void;
  hideSelected: () => void;
  duplicateSelected: () => void;
  restoreFromTrash: (studioId: string) => void;
  moveSelected: (dir: "up" | "down") => void;
  insertBlock: (kind: import("@/lib/studio-types").StudioBlockKind) => void;
  undo: () => void;
  redo: () => void;
  jumpToSnapshot: (id: string) => void;
  saveSnapshot: (label: string) => void;
  saveDraft: () => Promise<void>;
  publish: () => Promise<void>;
  refreshLayers: () => void;
  setHoverElement: (el: HTMLElement | null) => void;
  canvasWidth: number;
};

const StudioContext = createContext<StudioCtx | null>(null);

function reducer(h: History, a: { type: "set"; next: StudioPageState } | { type: "undo" } | { type: "redo" }): History {
  if (a.type === "undo") {
    if (!h.past.length) return h;
    const prev = h.past[h.past.length - 1];
    return { past: h.past.slice(0, -1), present: prev, future: [h.present, ...h.future] };
  }
  if (a.type === "redo") {
    if (!h.future.length) return h;
    const next = h.future[0];
    return { past: [...h.past, h.present], present: next, future: h.future.slice(1) };
  }
  return { past: [...h.past, h.present].slice(-HISTORY_CAP), present: a.next, future: [] };
}

export function StudioRuntimeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageKey = resolveStudioPageKey(pathname);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudioMode, setStudioMode] = useState(false);
  const [viewport, setViewport] = useState<StudioViewport>("desktop");
  const [zoom, setZoom] = useState(100);
  const [xRay, setXRay] = useState(true);
  const [gridGuides, setGridGuides] = useState(false);
  const [layers, setLayers] = useState<StudioLayerNode[]>([]);
  const [hoverEl, setHoverEl] = useState<HTMLElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [history, dispatch] = useReducer(reducer, { past: [], present: { ...EMPTY_STUDIO_PAGE_STATE }, future: [] });
  const hoverTarget = hoverEl ? history.present.overrides[elementStudioId(hoverEl)] ?? null : null;
  const hoverRect = hoverEl?.getBoundingClientRect() ?? null;
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canvasWidth = viewport === "desktop" ? 1440 : viewport === "tablet" ? 768 : 390;

  useEffect(() => {
    void fetch("/api/admin/visual-builder/session").then(async (r) => {
      if (!r.ok) return;
      const body = await r.json();
      setIsAdmin(Boolean(body.isAdmin));
    });
  }, []);

  useEffect(() => {
    const urlStudio = searchParams.get("studio") === "true" || searchParams.get("studio") === "1";
    const on = isAdmin && urlStudio;
    setStudioMode(on);
    if (typeof window !== "undefined") {
      if (on) localStorage.setItem(STUDIO_STORAGE_EDITOR, "1");
      else localStorage.removeItem(STUDIO_STORAGE_EDITOR);
    }
  }, [isAdmin, searchParams]);

  useEffect(() => {
    void fetch(`/api/studio/runtime?page=${pageKey}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        if (body?.state && !isStudioMode) dispatch({ type: "set", next: body.state as StudioPageState });
      });
  }, [pageKey, isStudioMode]);

  useEffect(() => {
    const root = document.getElementById("content");
    if (!root) return;

    const load = async () => {
      if (!isStudioMode) return;
      const endpoint = `/api/admin/studio-state?page=${pageKey}`;
      const localKey = `${STUDIO_STORAGE_DRAFT}-${pageKey}`;
      if (isStudioMode) {
        const local = localStorage.getItem(localKey);
        if (local) {
          try {
            dispatch({ type: "set", next: JSON.parse(local) as StudioPageState });
          } catch {
            /* */
          }
        }
      }
      const res = await fetch(endpoint);
      if (res.ok) {
        const body = await res.json();
        if (body?.state) dispatch({ type: "set", next: body.state as StudioPageState });
      }
    };
    void load();
  }, [isStudioMode, pageKey]);

  const persistDraft = useCallback(
    (next: StudioPageState) => {
      if (!isStudioMode) return;
      localStorage.setItem(`${STUDIO_STORAGE_DRAFT}-${pageKey}`, JSON.stringify(next));
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void fetch("/api/admin/studio-state", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageKey, state: next }),
        });
      }, 500);
    },
    [isStudioMode, pageKey],
  );

  const patchState = useCallback(
    (mutate: (s: StudioPageState) => StudioPageState) => {
      const next = mutate(history.present);
      dispatch({ type: "set", next });
      persistDraft(next);
    },
    [history.present, persistDraft],
  );

  const refreshLayers = useCallback(() => {
    const root = document.getElementById("content");
    if (!root) return;
    hydrateStudioIds(root);
    setLayers(buildLayerTree(root));
  }, []);

  const setHoverElement = useCallback((el: HTMLElement | null) => setHoverEl(el), []);

  const bp: "desktop" | "mobile" = viewport === "mobile" ? "mobile" : "desktop";

  useEffect(() => {
    const root = document.getElementById("content");
    if (!root) return;
    const hasOverrides =
      Object.keys(history.present.overrides).length > 0 || history.present.insertedBlocks.length > 0;
    if (!isStudioMode && !hasOverrides) return;
    const t = window.requestAnimationFrame(() => {
      applyPublishedState(root, history.present, bp);
      if (isStudioMode) refreshLayers();
    });
    return () => cancelAnimationFrame(t);
  }, [history.present, bp, isStudioMode, refreshLayers]);

  const selectedEl = useMemo(() => {
    if (!selectedId) return null;
    const el = document.querySelector(`[data-studio-id="${CSS.escape(selectedId)}"]`);
    return el instanceof HTMLElement ? el : null;
  }, [selectedId, history.present, hoverRect]);

  const selectedOverride = selectedId ? history.present.overrides[selectedId] ?? null : null;

  const patchOverride = useCallback(
    (patch: Partial<StudioNodeOverride> & { studioId: string; tag?: string }) => {
      patchState((s) => ({
        ...s,
        overrides: mergeOverride(s.overrides, {
          ...patch,
          tag: patch.tag ?? s.overrides[patch.studioId]?.tag ?? "div",
        }),
      }));
      const root = document.getElementById("content");
      const el = root?.querySelector(`[data-studio-id="${CSS.escape(patch.studioId)}"]`);
      if (el instanceof HTMLElement) {
        const merged = mergeOverride(history.present.overrides, patch as StudioNodeOverride);
        applyNodeOverride(el, merged[patch.studioId], bp);
      }
    },
    [patchState, history.present.overrides, bp],
  );

  const selectById = useCallback(
    (id: string | null) => {
      setSelectedId(id);
      if (!id) return;
      const el = document.querySelector(`[data-studio-id="${CSS.escape(id)}"]`);
      if (el instanceof HTMLElement) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },
    [],
  );

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    const ov = history.present.overrides[selectedId];
    patchState((s) => {
      const nextOv = { ...(ov ?? { studioId: selectedId, tag: "div" }), deleted: true };
      return {
        ...s,
        overrides: mergeOverride(s.overrides, nextOv),
        trash: [...s.trash.filter((t) => t.studioId !== selectedId), nextOv],
      };
    });
    const el = document.querySelector(`[data-studio-id="${CSS.escape(selectedId)}"]`);
    if (el instanceof HTMLElement) el.style.display = "none";
  }, [selectedId, history.present.overrides, patchState]);

  const hideSelected = useCallback(() => {
    if (!selectedId) return;
    patchOverride({ studioId: selectedId, hidden: true });
    const el = document.querySelector(`[data-studio-id="${CSS.escape(selectedId)}"]`);
    if (el instanceof HTMLElement) el.style.display = "none";
  }, [selectedId, patchOverride]);

  const duplicateSelected = useCallback(() => {
    if (!selectedEl) return;
    const clone = selectedEl.cloneNode(true) as HTMLElement;
    const newId = `${elementStudioId(selectedEl)}-dup-${Date.now()}`;
    clone.setAttribute("data-studio-id", newId);
    selectedEl.parentElement?.insertBefore(clone, selectedEl.nextSibling);
    const { tag, label } = describeElement(clone);
    patchOverride({ studioId: newId, tag, label, text: clone.textContent ?? "" });
    refreshLayers();
    selectById(newId);
  }, [selectedEl, patchOverride, refreshLayers, selectById]);

  const restoreFromTrash = useCallback(
    (studioId: string) => {
      patchState((s) => ({
        ...s,
        trash: s.trash.filter((t) => t.studioId !== studioId),
        overrides: mergeOverride(s.overrides, { studioId, deleted: false, hidden: false }),
      }));
      const el = document.querySelector(`[data-studio-id="${CSS.escape(studioId)}"]`);
      if (el instanceof HTMLElement) el.style.display = "";
    },
    [patchState],
  );

  const moveSelected = useCallback(
    (dir: "up" | "down") => {
      if (!selectedEl?.parentElement) return;
      const sib = dir === "up" ? selectedEl.previousElementSibling : selectedEl.nextElementSibling;
      if (!sib) return;
      if (dir === "up") selectedEl.parentElement.insertBefore(selectedEl, sib);
      else selectedEl.parentElement.insertBefore(sib, selectedEl);
      refreshLayers();
    },
    [selectedEl, refreshLayers],
  );

  const blockHtml: Record<string, string> = {
    heading: '<h2 class="font-display text-4xl text-[#244936]">New luxury heading</h2>',
    paragraph: '<p class="mt-3 max-w-2xl text-[#617768]">Add your paragraph copy here.</p>',
    "gold-button": '<a href="/quote" class="liquid-button mt-4 inline-flex rounded-full px-6 py-3 text-xs font-bold uppercase">Plan your event</a>',
    "whatsapp-cta":
      '<div class="mt-6 rounded-2xl border border-[#C9A227]/40 bg-[#07261C]/60 p-5 text-[#DCE8DF]"><p class="font-bold text-[#E5C158]">WhatsApp us</p><p class="text-sm">Fast replies for event dates.</p></div>',
    "review-card":
      '<div class="rounded-2xl border border-white/10 bg-[#0A1F16] p-5"><p class="text-[#E5C158]">★★★★★</p><p class="mt-2 text-sm text-[#DCE8DF]">Guest review placeholder</p></div>',
    "html-embed": '<div class="aspect-video w-full overflow-hidden rounded-xl bg-black/20"><p class="p-4 text-xs text-white/70">Paste embed HTML in the inspector.</p></div>',
  };

  const insertBlock = useCallback(
    (kind: import("@/lib/studio-types").StudioBlockKind) => {
      const id = `insert-${kind}-${Date.now()}`;
      const html = blockHtml[kind] ?? blockHtml.paragraph;
      patchState((s) => ({
        ...s,
        insertedBlocks: [...s.insertedBlocks, { id, kind, html }],
      }));
      setTimeout(refreshLayers, 50);
    },
    [patchState, refreshLayers],
  );

  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);

  const saveSnapshot = useCallback(
    (label: string) => {
      const snap: StudioSnapshot = {
        id: `snap-${Date.now()}`,
        label,
        createdAt: new Date().toISOString(),
        state: history.present,
      };
      patchState((s) => ({ ...s, snapshots: [snap, ...s.snapshots].slice(0, 20) }));
    },
    [history.present, patchState],
  );

  const jumpToSnapshot = useCallback(
    (id: string) => {
      const snap = history.present.snapshots.find((s) => s.id === id);
      if (snap) dispatch({ type: "set", next: snap.state });
    },
    [history.present.snapshots],
  );

  const saveDraft = useCallback(async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/studio-state", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey, state: history.present }),
      });
    } finally {
      setSaving(false);
    }
  }, [history.present, pageKey]);

  const publish = useCallback(async () => {
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/studio-state/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey, state: history.present }),
      });
      if (!res.ok) throw new Error("Publish failed");
      window.location.reload();
    } finally {
      setPublishing(false);
    }
  }, [history.present, pageKey]);

  const value = useMemo<StudioCtx>(
    () => ({
      pageKey,
      isAdmin,
      isStudioMode,
      xRay,
      gridGuides,
      viewport,
      zoom,
      state: history.present,
      layers,
      hoverTarget,
      hoverRect,
      hoverEl,
      selectedId,
      selectedEl,
      selectedOverride,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      publishing,
      saving,
      setViewport,
      setZoom,
      setXRay,
      setGridGuides,
      selectById,
      patchOverride,
      deleteSelected,
      hideSelected,
      duplicateSelected,
      restoreFromTrash,
      moveSelected,
      insertBlock,
      undo,
      redo,
      jumpToSnapshot,
      saveSnapshot,
      saveDraft,
      publish,
      refreshLayers,
      setHoverElement,
      canvasWidth,
    }),
    [
      pageKey,
      isAdmin,
      isStudioMode,
      xRay,
      gridGuides,
      viewport,
      zoom,
      history,
      layers,
      hoverTarget,
      hoverRect,
      hoverEl,
      selectedId,
      selectedEl,
      selectedOverride,
      publishing,
      saving,
      selectById,
      patchOverride,
      deleteSelected,
      hideSelected,
      duplicateSelected,
      restoreFromTrash,
      moveSelected,
      insertBlock,
      undo,
      redo,
      jumpToSnapshot,
      saveSnapshot,
      saveDraft,
      publish,
      refreshLayers,
      setHoverElement,
      canvasWidth,
    ],
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio requires StudioRuntimeProvider");
  return ctx;
}

export function useStudioOptional() {
  return useContext(StudioContext);
}

export function studioPageHref(key: typeof STUDIO_PAGES[number]["key"]) {
  return STUDIO_PAGES.find((p) => p.key === key)?.href ?? "/?studio=true";
}