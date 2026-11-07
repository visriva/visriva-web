"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_STATIONS,
  buildQuoteSelection,
  getLuxuryStationPrice,
  type LuxuryStation,
} from "@/lib/luxury-stations";

const STORAGE_KEY = "visriva-booking-draft";

type BookingContextValue = {
  selectedIds: string[];
  toteBagTierIndex: number;
  pvcCardCount: number;
  toggleStation: (id: string) => void;
  setToteBagTierIndex: (i: number) => void;
  setPvcCardCount: (n: number) => void;
  selectedStations: LuxuryStation[];
  subtotal: number;
  quoteHref: string;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>(["unlimited-dslr"]);
  const [toteBagTierIndex, setToteBagTierIndex] = useState(0);
  const [pvcCardCount, setPvcCardCount] = useState(100);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        selectedIds?: string[];
        toteBagTierIndex?: number;
        pvcCardCount?: number;
      };
      if (parsed.selectedIds?.length) setSelectedIds(parsed.selectedIds);
      if (typeof parsed.toteBagTierIndex === "number") setToteBagTierIndex(parsed.toteBagTierIndex);
      if (typeof parsed.pvcCardCount === "number") setPvcCardCount(parsed.pvcCardCount);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedIds, toteBagTierIndex, pvcCardCount }),
    );
  }, [selectedIds, toteBagTierIndex, pvcCardCount]);

  const toggleStation = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const selectedStations = useMemo(
    () => INITIAL_STATIONS.filter((s) => selectedIds.includes(s.id)),
    [selectedIds],
  );

  const subtotal = useMemo(
    () =>
      selectedStations.reduce(
        (sum, s) => sum + getLuxuryStationPrice(s, toteBagTierIndex, pvcCardCount),
        0,
      ),
    [selectedStations, toteBagTierIndex, pvcCardCount],
  );

  const quoteHref = useMemo(() => {
    const map = buildQuoteSelection(selectedIds, toteBagTierIndex, pvcCardCount);
    const parts: string[] = [];
    for (const [id, count] of Object.entries(map)) {
      const repeats = id === "pvc-cards" ? 1 : count;
      for (let i = 0; i < repeats; i += 1) parts.push(id);
    }
    return `/quote?services=${encodeURIComponent(parts.join(","))}`;
  }, [selectedIds, toteBagTierIndex, pvcCardCount]);

  const value = useMemo(
    () => ({
      selectedIds,
      toteBagTierIndex,
      pvcCardCount,
      toggleStation,
      setToteBagTierIndex,
      setPvcCardCount,
      selectedStations,
      subtotal,
      quoteHref,
    }),
    [
      selectedIds,
      toteBagTierIndex,
      pvcCardCount,
      toggleStation,
      selectedStations,
      subtotal,
      quoteHref,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking requires BookingProvider");
  return ctx;
}
