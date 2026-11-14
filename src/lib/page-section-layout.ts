export type SectionSlot = {
  id: string;
  visible: boolean;
  order: number;
};

export type PageLayoutState = {
  sections: SectionSlot[];
  archived: SectionSlot[];
};

export function sortSections(sections: SectionSlot[]) {
  return [...sections].sort((a, b) => a.order - b.order);
}

export function visibleSectionIds(layout: PageLayoutState): string[] {
  return sortSections(layout.sections)
    .filter((s) => s.visible)
    .map((s) => s.id);
}

export function toggleSectionVisibility(layout: PageLayoutState, id: string): PageLayoutState {
  return {
    ...layout,
    sections: layout.sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
  };
}

export function moveSection(layout: PageLayoutState, id: string, direction: "up" | "down"): PageLayoutState {
  const ordered = sortSections(layout.sections);
  const index = ordered.findIndex((s) => s.id === id);
  if (index < 0) return layout;
  const swap = direction === "up" ? index - 1 : index + 1;
  if (swap < 0 || swap >= ordered.length) return layout;
  const next = [...ordered];
  const aOrder = next[index].order;
  next[index] = { ...next[index], order: next[swap].order };
  next[swap] = { ...next[swap], order: aOrder };
  return { ...layout, sections: next };
}

export function deleteSection(layout: PageLayoutState, id: string): PageLayoutState {
  const target = layout.sections.find((s) => s.id === id);
  if (!target) return layout;
  return {
    sections: layout.sections.filter((s) => s.id !== id),
    archived: [...layout.archived, { ...target, visible: false }],
  };
}

export function restoreSection(layout: PageLayoutState, id: string): PageLayoutState {
  const target = layout.archived.find((s) => s.id === id);
  if (!target) return layout;
  const maxOrder = layout.sections.reduce((m, s) => Math.max(m, s.order), -1);
  return {
    archived: layout.archived.filter((s) => s.id !== id),
    sections: [...layout.sections, { ...target, visible: true, order: maxOrder + 1 }],
  };
}

export function ensureLayout(ids: readonly string[], layout?: PageLayoutState | null): PageLayoutState {
  if (!layout?.sections?.length) {
    return {
      sections: ids.map((id, order) => ({ id, visible: true, order })),
      archived: [],
    };
  }
  const known = new Set(ids);
  const sections = sortSections(layout.sections).filter((s) => known.has(s.id));
  for (const id of ids) {
    if (!sections.some((s) => s.id === id)) {
      const maxOrder = sections.reduce((m, s) => Math.max(m, s.order), -1);
      sections.push({ id, visible: true, order: maxOrder + 1 });
    }
  }
  const archived = (layout.archived ?? []).filter((s) => known.has(s.id) && !sections.some((x) => x.id === s.id));
  return { sections, archived };
}

export function moveListItem<T>(items: T[], index: number, direction: "up" | "down"): T[] {
  const swap = direction === "up" ? index - 1 : index + 1;
  if (swap < 0 || swap >= items.length) return items;
  const next = [...items];
  [next[index], next[swap]] = [next[swap], next[index]];
  return next;
}