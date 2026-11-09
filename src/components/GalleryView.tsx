"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { galleryFilms, galleryItems } from "@/lib/site";

const filters = ["All", "Gatherings", "Stations", "Night"] as const;

export function GalleryView({ films }: { films: boolean }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [open, setOpen] = useState<(typeof galleryItems)[number] | null>(null);
  const items = galleryItems.filter((item) => filter === "All" || item.tag === filter);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`border px-4 py-2 font-royal text-[0.62rem] uppercase tracking-[0.2em] ${
              filter === item ? "border-[#b8a04d] bg-[#b8a04d] text-[#032216]" : "border-[#b8a04d]/30 bg-[#062619]/70 text-[#d9dfd2] hover:border-[#d1bd73] hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpen(item)}
            className="mb-4 block w-full break-inside-avoid text-left"
          >
            <figure className="image-card relative overflow-hidden rounded-2xl border border-[#b8a04d]/25 bg-[#062619]">
              <div className={`relative ${item.tall ? "h-[28rem]" : "h-64"}`}>
                <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover transition duration-700 hover:scale-105" />
              </div>
              <figcaption className="flex items-center justify-between bg-[#062619] px-4 py-3 text-sm text-[#f5f0df]">
                <span>{item.caption}</span>
                <span className="text-[.62rem] font-semibold uppercase tracking-[.15em] text-[#d1bd73]">{item.tag}</span>
              </figcaption>
            </figure>
          </button>
        ))}
      </div>

      <div className="mt-16 border-t border-[#b8a04d]/25 pt-12">
        <h2 className="font-display text-4xl text-[#f5f0df]">Film slots</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#b7c5b7]">
          Drop mp4 files into public/films using the names below. Until then the frame holds a still.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {galleryFilms.map((film) => (
            <figure key={film.title} className="relative h-56 overflow-hidden rounded-2xl border border-[#b8a04d]/25">
              {films ? (
                <video className="h-full w-full object-cover" autoPlay muted loop playsInline poster={film.poster}>
                  <source src={film.src} type="video/mp4" />
                </video>
              ) : (
                <Image src={film.poster} alt="" fill className="object-cover" sizes="33vw" />
              )}
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 text-sm text-white">
                {film.title}
                <span className="mt-1 block text-[.6rem] font-semibold uppercase tracking-[.15em] text-[#e5cf83]">
                  {film.src.replace("/films/", "")}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[95] grid place-items-center bg-black/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={open.caption}
          onClick={() => setOpen(null)}
        >
          <figure className="relative h-[min(80svh,820px)] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <Image src={open.src} alt={open.alt} fill className="object-contain" sizes="100vw" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-deep/80 px-4 py-3 text-sm text-cream">
              {open.caption}. Stand-in frame for the Visriva archive.
            </figcaption>
            <button type="button" className="absolute right-0 top-0 bg-gold px-3 py-2 text-xs uppercase tracking-[0.18em] text-deep" onClick={() => setOpen(null)}>
              Close
            </button>
          </figure>
        </div>
      ) : null}
    </div>
  );
}
