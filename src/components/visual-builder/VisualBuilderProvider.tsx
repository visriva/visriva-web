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
  deleteSection,
  moveSection,
  restoreSection,
  toggleSectionVisibility,
  type PageLayoutState,
} from "@/lib/page-section-layout";
import {
  EMPTY_VISUAL_STATE,
  type VisualBuilderPageKey,
  type VisualBuilderState,
  type VisualImageSlot,
} from "@/lib/visual-builder-types";

const STORAGE_EDITOR = "visriva-live-editor";
const STORAGE_DRAFT = "visriva-vb-draft";

type History = { past: VisualBuilderState[]; present: VisualBuilderState; future: VisualBuilderState[] };

type Ctx = {
  pageKey: VisualBuilderPageKey;
  isAdmin: boolean;
  editorOn: boolean;
  isEditMode: boolean;
  previewMode: boolean;
  viewport: "desktop" | "mobile";
  state: VisualBuilderState;
  setEditorOn: (v: boolean) => void;
  setPreviewMode: (v: boolean) => void;
  setViewport: (v: "desktop" | "mobile") => void;
  text: (key: string, fallback: string) => string;
  image: (key: string, fallback: string) => string;
  imageAlt: (key: string, fallback: string) => string;
  setText: (key: string, value: string) => void;
  setImage: (key: string, slot: VisualImageSlot) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  publish: () => Promise<void>;
  publishing: boolean;
  toggleSection: (id: string) => void;
  moveSectionUp: (id: string) => void;
  moveSectionDown: (id: string) => void;
  deleteSectionById: (id: string) => void;
  restoreSectionById: (id: string) => void;
  initHomeLayout: (layout: PageLayoutState) => void;
};

const VisualBuilderContext = createContext<Ctx | null>(null);

function resolvePageKey(pathname: string): VisualBuilderPageKey {
  if (pathname.startsWith("/qr")) return "qr";
  if (pathname.startsWith("/reviews") || pathname === "/review") return "reviews";
  if (pathname.startsWith("/photo-booths") || pathname.startsWith("/ai-merchandise") || pathname.startsWith("/games-vr")) {
    return "services";
  }
  return "home";
}

function reducer(history: History, action: { type: "set"; next: VisualBuilderState } | { type: "undo" } | { type: "redo" }): History {
  if (action.type === "undo") {
    if (!history.past.length) return history;
    const previous = history.past[history.past.length - 1];
    return {
      past: history.past.slice(0, -1),
      present: previous,
      future: [history.present, ...history.future],
    };
  }
  if (action.type === "redo") {
    if (!history.future.length) return history;
    const next = history.future[0];
    return {
      past: [...history.past, history.present],
      present: next,
      future: history.future.slice(1),
    };
  }
  return {
    past: [...history.past, history.present].slice(-40),
    present: action.next,
    future: [],
  };
}

export function VisualBuilderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageKey = resolvePageKey(pathname);

  const [isAdmin, setIsAdmin] = useState(false);
  const [editorOn, setEditorOn] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [publishing, setPublishing] = useState(false);
  const [history, dispatch] = useReducer(reducer, { past: [], present: { ...EMPTY_VISUAL_STATE }, future: [] });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const layoutSeeded = useRef(false);

  useEffect(() => {
    void fetch("/api/admin/visual-builder/session").then(async (r) => {
      if (!r.ok) return;
      const body = await r.json();
      setIsAdmin(Boolean(body.isAdmin));
    });
  }, []);

  useEffect(() => {
    const urlEdit = searchParams.get("edit") === "1" || searchParams.get("edit") === "true";
    const stored = typeof window !== "undefined" && localStorage.getItem(STORAGE_EDITOR) === "1";
    setEditorOn(isAdmin && (urlEdit || stored));
  }, [isAdmin, searchParams]);

  useEffect(() => {
    if (!isAdmin || !editorOn) return;
    const local = localStorage.getItem(`${STORAGE_DRAFT}-${pageKey}`);
    if (local) {
      try {
        dispatch({ type: "set", next: JSON.parse(local) as VisualBuilderState });
        return;
      } catch {
        /* fall through */
      }
    }
    void fetch(`/api/admin/visual-builder?page=${pageKey}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        if (body?.state) dispatch({ type: "set", next: body.state as VisualBuilderState });
      });
  }, [isAdmin, editorOn, pageKey]);

  const persistDraft = useCallback(
    (next: VisualBuilderState) => {
      localStorage.setItem(`${STORAGE_DRAFT}-${pageKey}`, JSON.stringify(next));
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void fetch("/api/admin/visual-builder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageKey, state: next }),
        });
      }, 600);
    },
    [pageKey],
  );

  const patch = useCallback(
    (mutate: (s: VisualBuilderState) => VisualBuilderState) => {
      const next = mutate(history.present);
      dispatch({ type: "set", next });
      persistDraft(next);
    },
    [history.present, persistDraft],
  );

  const setEditorOnWrapped = useCallback(
    (v: boolean) => {
      setEditorOn(v);
      localStorage.setItem(STORAGE_EDITOR, v ? "1" : "0");
    },
    [],
  );

  const initHomeLayout = useCallback(
    (layout: PageLayoutState) => {
      if (layoutSeeded.current || history.present.home_layout) return;
      layoutSeeded.current = true;
      patch((s) => ({ ...s, home_layout: layout }));
    },
    [history.present.home_layout, patch],
  );

  const publish = useCallback(async () => {
    setPublishing(true);
    try {
      const res = await fetch("/api/admin/visual-builder/publish", {
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

  const value = useMemo<Ctx>(
    () => ({
      pageKey,
      isAdmin,
      editorOn,
      isEditMode: isAdmin && editorOn && !previewMode,
      previewMode,
      viewport,
      state: history.present,
      setEditorOn: setEditorOnWrapped,
      setPreviewMode,
      setViewport,
      text: (key, fallback) => history.present.texts[key] ?? fallback,
      image: (key, fallback) => history.present.images[key]?.url ?? fallback,
      imageAlt: (key, fallback) => history.present.images[key]?.alt ?? fallback,
      setText: (key, value) => patch((s) => ({ ...s, texts: { ...s.texts, [key]: value } })),
      setImage: (key, slot) => patch((s) => ({ ...s, images: { ...s.images, [key]: slot } })),
      undo: () => dispatch({ type: "undo" }),
      redo: () => dispatch({ type: "redo" }),
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      publish,
      publishing,
      toggleSection: (id) =>
        patch((s) => ({
          ...s,
          home_layout: s.home_layout ? toggleSectionVisibility(s.home_layout, id) : s.home_layout,
        })),
      moveSectionUp: (id) =>
        patch((s) => ({
          ...s,
          home_layout: s.home_layout ? moveSection(s.home_layout, id, "up") : s.home_layout,
        })),
      moveSectionDown: (id) =>
        patch((s) => ({
          ...s,
          home_layout: s.home_layout ? moveSection(s.home_layout, id, "down") : s.home_layout,
        })),
      deleteSectionById: (id) =>
        patch((s) => ({
          ...s,
          home_layout: s.home_layout ? deleteSection(s.home_layout, id) : s.home_layout,
        })),
      restoreSectionById: (id) =>
        patch((s) => ({
          ...s,
          home_layout: s.home_layout ? restoreSection(s.home_layout, id) : s.home_layout,
        })),
      initHomeLayout,
    }),
    [pageKey, isAdmin, editorOn, previewMode, viewport, history, patch, publish, publishing, setEditorOnWrapped, initHomeLayout],
  );

  const shellClass =
    viewport === "mobile" && value.isEditMode
      ? "mx-auto min-h-full max-w-[430px] overflow-x-hidden border-x border-[#C9A227]/30 shadow-2xl"
      : "";

  return (
    <VisualBuilderContext.Provider value={value}>
      <div className={shellClass} data-vb-viewport={viewport}>
        {children}
      </div>
    </VisualBuilderContext.Provider>
  );
}

export function useVisualBuilder() {
  const ctx = useContext(VisualBuilderContext);
  if (!ctx) throw new Error("useVisualBuilder must be used within VisualBuilderProvider");
  return ctx;
}

export function useVisualBuilderOptional() {
  return useContext(VisualBuilderContext);
}