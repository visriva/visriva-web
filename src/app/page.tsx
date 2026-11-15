import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExperienceDeck } from "@/components/ExperienceDeck";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { StatsBar } from "@/components/StatsBar";
import { RateList } from "@/components/RateList";
import { getPublishedCatalog } from "@/lib/services-catalog";
import { getSiteGlobals } from "@/lib/site-globals";
import { visibleSectionIds } from "@/lib/page-section-layout";
import { getWebsitePage } from "@/lib/website-pages";
import { siteUrl } from "@/lib/site";
import { QuoteDeck, WaveRevealButton } from "@/components/FramerSuite";
import { VisrivaGoogleReviewSection } from "@/components/reviews/VisrivaGoogleReviewSection";
import { getGoogleReviewSettings } from "@/lib/google-review";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWebsitePage("home");
  const title = page?.seo_title || "Visriva | Experiential stations for events in Bengaluru";
  const description = page?.seo_description || "Create unforgettable event moments with photo experiences, AI-powered keepsakes, live merchandise, VR and interactive games. One team, end to end.";
  return { title, description, alternates: { canonical: siteUrl }, openGraph: { title, description, url: siteUrl, siteName: "Visriva", images: page?.og_image ? [page.og_image] : ["/brand/visriva-logo.png"] }, twitter: { card: "summary_large_image", title, description, images: page?.og_image ? [page.og_image] : ["/brand/visriva-logo.png"] } };
}

function splitTitleLines(text: string) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 ? <br /> : null}
    </span>
  ));
}

export default async function HomePage() {
  const [catalog, pageContent, globals, googleReviewSettings] = await Promise.all([
    getPublishedCatalog(),
    getWebsitePage("home"),
    getSiteGlobals(),
    getGoogleReviewSettings(),
  ]);
  const { experience, quote, brand_story, featured, process, closing } = globals.home_content;
  const ids = featured.service_ids.length ? featured.service_ids : ["unlimited-dslr", "ai-station", "vr-station"];
  const featuredServices = catalog.list.filter((service) => ids.includes(service.id) && service.bookable !== false);
  const show = new Set(visibleSectionIds(globals.home_layout));

  return (
    <main id="content" className="page-enter bg-[#E6EFE3]">
      {show.has("hero") ? <Hero pageContent={pageContent} /> : null}
      {show.has("stats") ? (
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <StatsBar stats={globals.stats} />
        </div>
      ) : null}

      {show.has("experience") ? <ExperienceDeck services={catalog.list} content={experience} /> : null}
      {show.has("quote") ? (
        <section className="bg-[#F8F7EF] px-5 pb-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1500px]">
            <QuoteDeck content={quote} />
          </div>
        </section>
      ) : null}

      {show.has("brand_story") ? (
        <section className="bg-[#F5F0DF] px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1500px] items-center gap-12 lg:grid-cols-[.95fr_1.05fr]">
            <Reveal className="relative">
              <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white shadow-[0_24px_70px_rgba(39,67,48,.13)] sm:min-h-[540px]">
                <Image src={brand_story.image_url || "/images/party.jpg"} alt={brand_story.image_alt} fill sizes="(min-width:1024px) 48vw,100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#173d2b]/65 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/65 bg-[#f8f7ef]/90 p-5 shadow-xl backdrop-blur-xl sm:right-auto sm:max-w-sm">
                  <p className="section-kicker">{brand_story.overlay_kicker}</p>
                  <p className="mt-2 font-display text-3xl leading-none text-[#294937]">{splitTitleLines(brand_story.overlay_title)}</p>
                </div>
              </div>
            </Reveal>
            <div className="flex flex-col justify-center">
              <Reveal>
                <p className="section-kicker">{brand_story.kicker}</p>
                <h2 className="display-heading mt-4 text-6xl text-[#244936] sm:text-7xl">
                  {brand_story.title}
                  <br />
                  <em className="gold-gradient">{brand_story.title_accent}</em>
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-[#617768]">{brand_story.body}</p>
              </Reveal>
              <div className="mt-8 divide-y divide-[#d5e0d1] border-y border-[#d5e0d1]">
                {brand_story.promises.map((item, index) => (
                  <Reveal key={`${item.n}-${item.title}`} delay={index * 80}>
                    <article className="grid grid-cols-[48px_1fr] gap-4 py-5">
                      <span className="pt-1 text-xs font-bold text-[#a88f3e]">{item.n}</span>
                      <div>
                        <h3 className="font-semibold text-[#294937]">{item.title}</h3>
                        <p className="mt-2 max-w-lg text-sm leading-7 text-[#617768]">{item.body}</p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {show.has("featured") ? (
        <section className="bg-[#DCE9D8] px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="section-kicker">{featured.kicker}</p>
                <h2 className="display-heading mt-4 text-6xl text-[#244936] sm:text-7xl">
                  {featured.title}
                  <br />
                  <em className="gold-gradient">{featured.title_accent}</em>
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-[#617768]">{featured.sidebar}</p>
            </div>
            <div className="mt-10">
              <RateList services={featuredServices} />
            </div>
            <div className="mt-8 flex justify-end">
              <Link href={featured.cta_href} className="liquid-button inline-flex rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[.15em]">
                {featured.cta_text}
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {show.has("process") ? (
        <section className="bg-[#F5F0DF] px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="section-kicker">{process.kicker}</p>
                <h2 className="display-heading mt-4 text-6xl text-[#244936] sm:text-7xl">
                  {process.title}
                  <br />
                  <em className="gold-gradient">{process.title_accent}</em>
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-[#617768]">{process.sidebar}</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {process.steps.map((step, index) => (
                <Reveal key={`${step.n}-${step.title}`} delay={index * 90}>
                  <article className="h-full rounded-2xl border border-[#D7DCCB] bg-white/90 p-7 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(39,67,48,.08)]">
                    <span className="inline-grid h-10 w-10 place-items-center rounded-full bg-[#e7efe3] text-xs font-semibold text-[#947d34]">{step.n}</span>
                    <h3 className="mt-5 font-display text-4xl text-[#294937]">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#617768]">{step.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {googleReviewSettings.enabled && googleReviewSettings.show_on_home ? (
        <section className="bg-[#E6EFE3] px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1500px]">
            <VisrivaGoogleReviewSection settings={googleReviewSettings} variant="home" />
          </div>
        </section>
      ) : null}

      {show.has("closing") ? (
        <section className="bg-[#DCE9D8] px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-8 rounded-[2rem] border border-[#CBDCC7] bg-[#F8F7EF] px-7 py-14 shadow-[0_25px_70px_rgba(39,67,48,.08)] sm:px-12 lg:flex-row lg:items-end">
            <div>
              <p className="section-kicker">{closing.kicker}</p>
              <h2 className="display-heading mt-4 max-w-3xl text-6xl text-[#244936] sm:text-7xl">
                {closing.title}
                <br />
                <em className="gold-gradient">{closing.title_accent}</em>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-[#617768]">{closing.body}</p>
            </div>
            <WaveRevealButton href={closing.button_href} label={closing.button_label} />
          </div>
        </section>
      ) : null}
    </main>
  );
}