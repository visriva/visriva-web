"use client";

import type { SiteGlobals } from "@/lib/site-globals-types";
import { HOME_SECTION_LABELS, type HomeSectionId } from "@/lib/site-globals-types";
import { AdminRestoreSectionsDrawer } from "@/components/admin/AdminRestoreSectionsDrawer";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";
import { deleteSection, moveSection, restoreSection, sortSections, toggleSectionVisibility } from "@/lib/page-section-layout";

export function AdminHomeLayout({
  globals,
  onChange,
}: {
  globals: SiteGlobals;
  onChange: (next: SiteGlobals) => void;
}) {
  const ordered = sortSections(globals.home_layout.sections);
  const archived = globals.home_layout.archived.map((s) => ({
    id: s.id,
    label: HOME_SECTION_LABELS[s.id as HomeSectionId] ?? s.id,
  }));

  function setLayout(next: SiteGlobals["home_layout"]) {
    onChange({ ...globals, home_layout: next });
  }

  return (
    <div className="mt-10 space-y-4 rounded-2xl border border-gold/20 bg-[#0D2117] p-5 sm:p-7">
      <p className="section-kicker">Homepage section order</p>
      <p className="text-sm text-mist">Reorder, hide, delete, or restore homepage sections. Save footer & stats below to publish layout.</p>
      {ordered.map((slot, index) => {
        const id = slot.id as HomeSectionId;
        return (
          <AdminSectionShell
            key={id}
            title={HOME_SECTION_LABELS[id] ?? id}
            visible={slot.visible}
            canMoveUp={index > 0}
            canMoveDown={index < ordered.length - 1}
            onToggleVisible={() => setLayout(toggleSectionVisibility(globals.home_layout, id))}
            onMoveUp={() => setLayout(moveSection(globals.home_layout, id, "up"))}
            onMoveDown={() => setLayout(moveSection(globals.home_layout, id, "down"))}
            onDelete={() => setLayout(deleteSection(globals.home_layout, id))}
          >
            <p className="text-xs text-mist">Content for this block is edited in Website pages (home) or Services where applicable.</p>
          </AdminSectionShell>
        );
      })}
      <AdminRestoreSectionsDrawer archived={archived} onRestore={(id) => setLayout(restoreSection(globals.home_layout, id))} />
    </div>
  );
}