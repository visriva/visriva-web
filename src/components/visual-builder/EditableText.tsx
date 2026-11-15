"use client";

import { Bold, Italic, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useVisualBuilderOptional } from "@/components/visual-builder/VisualBuilderProvider";

type Props = {
  fieldKey: string;
  defaultValue: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
  onDelete?: () => void;
};

export function EditableText({ fieldKey, defaultValue, as: Tag = "span", className = "", onDelete }: Props) {
  const vb = useVisualBuilderOptional();
  const ref = useRef<HTMLElement>(null);
  const [focused, setFocused] = useState(false);
  const value = vb?.text(fieldKey, defaultValue) ?? defaultValue;
  const edit = vb?.isEditMode;

  useEffect(() => {
    if (!edit || !ref.current) return;
    if (ref.current.textContent !== value) ref.current.textContent = value;
  }, [edit, value]);

  if (!edit) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <span className="relative inline-block max-w-full">
      <Tag
        ref={ref as never}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          const next = ref.current?.textContent?.trim() ?? "";
          if (next && vb) vb.setText(fieldKey, next);
        }}
        className={`vb-editable-text outline-dashed outline-1 outline-[#C9A227] cursor-text ${className}`}
      >
        {value}
      </Tag>
      <span className="pointer-events-none absolute -top-6 left-0 rounded-full bg-[#07261C] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#E5C158]">
        ✎ Click to edit
      </span>
      {focused ? (
        <FormatBar
          onBold={() => document.execCommand("bold")}
          onItalic={() => document.execCommand("italic")}
          onGold={() => document.execCommand("foreColor", false, "#C9A227")}
          onDelete={onDelete}
        />
      ) : null}
    </span>
  );
}

function FormatBar({
  onBold,
  onItalic,
  onGold,
  onDelete,
}: {
  onBold: () => void;
  onItalic: () => void;
  onGold: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="absolute -top-14 left-0 z-[10001] flex items-center gap-1 rounded-full border border-[#C9A227]/50 bg-[#04150F] p-1 shadow-xl">
      <FormatBtn label="Bold" onClick={onBold}>
        <Bold className="h-3.5 w-3.5" />
      </FormatBtn>
      <FormatBtn label="Italic" onClick={onItalic}>
        <Italic className="h-3.5 w-3.5" />
      </FormatBtn>
      <FormatBtn label="Gold" onClick={onGold}>
        <span className="text-[#E5C158]">A</span>
      </FormatBtn>
      {onDelete ? (
        <FormatBtn label="Delete" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5 text-red-300" />
        </FormatBtn>
      ) : null}
    </div>
  );
}

function FormatBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className="grid h-8 w-8 place-items-center rounded-full text-white hover:bg-white/10">
      {children}
    </button>
  );
}