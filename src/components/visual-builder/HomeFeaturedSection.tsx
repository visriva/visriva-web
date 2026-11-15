"use client";

import Link from "next/link";
import type { HomeFeatured } from "@/lib/home-content-types";
import type { Service } from "@/lib/services";
import { EditableText } from "@/components/visual-builder/EditableText";
import { RateList } from "@/components/RateList";
import { useVisualBuilderOptional } from "@/components/visual-builder/VisualBuilderProvider";

export function HomeFeaturedSection({ featured, services }: { featured: HomeFeatured; services: Service[] }) {
  const vb = useVisualBuilderOptional();
  const ctaHref = vb?.text("featured_cta_href", featured.cta_href) ?? featured.cta_href;

  return (
    <section className="bg-[#DCE9D8] px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <EditableText fieldKey="featured_kicker" defaultValue={featured.kicker} as="p" className="section-kicker" />
            <h2 className="display-heading mt-4 text-6xl text-[#244936] sm:text-7xl">
              <EditableText fieldKey="featured_title" defaultValue={featured.title} as="span" />
              <br />
              <em className="gold-gradient">
                <EditableText fieldKey="featured_title_accent" defaultValue={featured.title_accent} as="span" />
              </em>
            </h2>
          </div>
          <EditableText fieldKey="featured_sidebar" defaultValue={featured.sidebar} as="p" className="max-w-sm text-sm leading-7 text-[#617768]" />
        </div>
        <div className="mt-10">
          <RateList services={services} liveEdit />
        </div>
        <div className="mt-8 flex justify-end">
          <Link href={ctaHref} className="liquid-button inline-flex rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.15em]">
            <EditableText fieldKey="featured_cta_text" defaultValue={featured.cta_text} as="span" />
          </Link>
        </div>
      </div>
    </section>
  );
}