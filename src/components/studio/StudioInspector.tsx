"use client";

import { ArrowDown, ArrowUp, Copy, Eye, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { describeElement, imageMeta } from "@/lib/studio-dom";
import { VISRIVA_BRAND_SWATCHES, type StudioBreakpoint, type StudioStylePatch } from "@/lib/studio-types";
import { useStudio } from "@/components/studio/StudioRuntimeProvider";

export function StudioInspector() {
  const studio = useStudio();
  const id = studio.selectedId;
  const ov = studio.selectedOverride;
  const el = studio.selectedEl;
  const bp: StudioBreakpoint = studio.viewport === "mobile" ? "mobile" : "desktop";
  const styles = ov?.styles?.[bp] ?? {};

  const imageInfo = useMemo(() => {
    if (!(el instanceof HTMLImageElement)) return null;
    const meta = imageMeta(el);
    const rect = el.getBoundingClientRect();
    return { ...meta, renderedW: Math.round(rect.width), renderedH: Math.round(rect.height) };
  }, [el, studio.state]);

  if (!id || !el) {
    return (
      <aside data-studio-ui className="flex w-80 shrink-0 flex-col border-l border-[#C9A227]/30 bg-[#03150F] p-4 text-sm text-mist">
        <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#C9A227]">Design inspector</p>
        <p className="mt-4">Click any element on the canvas to edit content, typography, spacing, and media.</p>
      </aside>
    );
  }

  const studioId = id;
  const { kind } = describeElement(el);

  function setStyle(patch: Partial<StudioStylePatch>) {
    studio.patchOverride({
      studioId,
      styles: { [bp]: { ...styles, ...patch } },
    });
  }

  async function onImageUpload(file: File) {
    const form = new FormData();
    form.append("file", file);
    form.append("slot", `studio-${studioId}`);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: form });
    if (!res.ok) return;
    const body = await res.json();
    const url = body.url as string;
    studio.patchOverride({ studioId, image: { url, alt: ov?.image?.alt ?? "" } });
    if (el instanceof HTMLImageElement) {
      el.src = url;
    }
  }

  return (
    <aside data-studio-ui className="flex w-80 shrink-0 flex-col border-l border-[#C9A227]/30 bg-[#03150F] text-[#E6DEC8]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#C9A227]">Inspector</p>
        <p className="mt-1 font-display text-lg text-[#E5C158]">{kind}</p>
        <p className="text-[10px] text-mist">{id}</p>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 text-xs">
        <section>
          <p className="mb-2 font-bold uppercase tracking-wider text-[#C9A227]">Content</p>
          <label className="block text-mist">
            Text
            <textarea
              className="mt-1 w-full rounded-lg border border-[#806B2D]/40 bg-[#0A1F16] px-2 py-2 text-[#F4F0DF]"
              rows={3}
              value={ov?.text ?? el.textContent ?? ""}
              onChange={(e) => {
                studio.patchOverride({ studioId, text: e.target.value });
                if (!["img", "video"].includes(el.tagName.toLowerCase())) el.textContent = e.target.value;
              }}
            />
          </label>
          {el instanceof HTMLAnchorElement || el.tagName === "BUTTON" ? (
            <label className="mt-2 block text-mist">
              Link URL
              <input
                className="mt-1 w-full rounded-lg border border-[#806B2D]/40 bg-[#0A1F16] px-2 py-2"
                value={ov?.href ?? (el instanceof HTMLAnchorElement ? el.href : "")}
                onChange={(e) => studio.patchOverride({ studioId, href: e.target.value })}
              />
            </label>
          ) : null}
        </section>

        {imageInfo ? (
          <section>
            <p className="mb-2 font-bold uppercase tracking-wider text-[#C9A227]">Image & media</p>
            <p className="rounded-lg border border-[#2EE6D6]/30 bg-[#041812] px-2 py-1.5 text-[10px] text-[#2EE6D6]">
              Current: {imageInfo.naturalWidth} × {imageInfo.naturalHeight} px • Rendered: {imageInfo.renderedW} × {imageInfo.renderedH} px
            </p>
            <p className="mt-1 text-[10px] text-mist">Recommended: 1200 × 675 px (16:9) for heroes</p>
            <input type="file" accept="image/*" className="mt-2 w-full text-[10px]" onChange={(e) => e.target.files?.[0] && void onImageUpload(e.target.files[0])} />
            <label className="mt-2 block">
              Alt text
              <input
                className="mt-1 w-full rounded-lg border border-[#806B2D]/40 bg-[#0A1F16] px-2 py-2"
                value={ov?.image?.alt ?? ""}
                onChange={(e) => studio.patchOverride({ studioId, image: { ...ov?.image, alt: e.target.value } })}
              />
            </label>
            <RangeField label="Zoom" min={1} max={2} step={0.05} value={ov?.image?.zoom ?? 1} onChange={(v) => studio.patchOverride({ studioId, image: { ...ov?.image, zoom: v } })} />
            <RangeField label="Focal X %" min={0} max={100} value={ov?.image?.focalX ?? 50} onChange={(v) => studio.patchOverride({ studioId, image: { ...ov?.image, focalX: v } })} />
            <RangeField label="Focal Y %" min={0} max={100} value={ov?.image?.focalY ?? 50} onChange={(v) => studio.patchOverride({ studioId, image: { ...ov?.image, focalY: v } })} />
          </section>
        ) : null}

        <section>
          <p className="mb-2 font-bold uppercase tracking-wider text-[#C9A227]">Typography ({bp})</p>
          <select className="w-full rounded-lg border border-[#806B2D]/40 bg-[#0A1F16] px-2 py-2" value={styles.fontFamily ?? ""} onChange={(e) => setStyle({ fontFamily: e.target.value })}>
            <option value="">Default</option>
            <option value="var(--font-cormorant), serif">Luxury serif</option>
            <option value="var(--font-outfit), sans-serif">Clean sans</option>
          </select>
          <RangeField label="Font size (px)" min={10} max={96} value={Number.parseInt(styles.fontSize ?? "16", 10) || 16} onChange={(v) => setStyle({ fontSize: `${v}px` })} />
          <RangeField label="Line height" min={1} max={2.4} step={0.05} value={Number.parseFloat(styles.lineHeight ?? "1.4")} onChange={(v) => setStyle({ lineHeight: String(v) })} />
          <RangeField label="Letter spacing (px)" min={-2} max={12} value={Number.parseFloat(styles.letterSpacing ?? "0")} onChange={(v) => setStyle({ letterSpacing: `${v}px` })} />
          <div className="mt-2 flex flex-wrap gap-1">
            {VISRIVA_BRAND_SWATCHES.map((c) => (
              <button key={c} type="button" aria-label={`Color ${c}`} className="h-6 w-6 rounded-full border border-white/30" style={{ background: c }} onClick={() => setStyle({ color: c })} />
            ))}
          </div>
        </section>

        <section>
          <p className="mb-2 font-bold uppercase tracking-wider text-[#C9A227]">Box & glass</p>
          <RangeField label="Padding top" min={0} max={120} value={Number.parseInt(styles.paddingTop ?? "0", 10) || 0} onChange={(v) => setStyle({ paddingTop: `${v}px` })} />
          <RangeField label="Backdrop blur" min={0} max={40} value={Number.parseInt(styles.backdropBlur ?? "0", 10) || 0} onChange={(v) => setStyle({ backdropBlur: `${v}px` })} />
          <RangeField label="Border radius" min={0} max={48} value={Number.parseInt(styles.borderRadius ?? "0", 10) || 0} onChange={(v) => setStyle({ borderRadius: `${v}px` })} />
        </section>

        <button type="button" onClick={() => studio.saveSnapshot(`Before ${kind} edit`)} className="w-full rounded-lg border border-[#C9A227]/40 py-2 text-[10px] font-bold uppercase text-[#E5C158]">
          Save timeline snapshot
        </button>
      </div>
      <div className="flex flex-wrap gap-1 border-t border-white/10 p-3">
        <IconAct icon={<ArrowUp className="h-3 w-3" />} label="Up" onClick={() => studio.moveSelected("up")} />
        <IconAct icon={<ArrowDown className="h-3 w-3" />} label="Down" onClick={() => studio.moveSelected("down")} />
        <IconAct icon={<Copy className="h-3 w-3" />} label="Duplicate" onClick={studio.duplicateSelected} />
        <IconAct icon={<Eye className="h-3 w-3" />} label="Hide" onClick={studio.hideSelected} />
        <IconAct icon={<Trash2 className="h-3 w-3" />} label="Delete" onClick={studio.deleteSelected} />
      </div>
    </aside>
  );
}

function RangeField({ label, min, max, step = 1, value, onChange }: { label: string; min: number; max: number; step?: number; value: number; onChange: (v: number) => void }) {
  return (
    <label className="mt-2 block text-mist">
      {label}: <span className="text-[#E5C158]">{value}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full accent-[#C9A227]" />
    </label>
  );
}

function IconAct({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/15 py-2 text-[9px] font-semibold uppercase tracking-wide hover:border-[#C9A227]/50">
      {icon} {label}
    </button>
  );
}