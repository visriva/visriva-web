import type { Metadata } from "next";
import Image from "next/image";
import QRCode from "qrcode";
import { DocForClientPrintButton } from "@/components/docforclient/DocForClientPrintButton";
import { siteUrl } from "@/lib/site";

const qrLandingUrl = `${siteUrl}/qr`;
const reviewsUrl = `${siteUrl}/reviews`;

export const metadata: Metadata = {
  title: "Guest & review QR handouts",
  description:
    "Printable QR codes for Visriva event guests — giveaway, photos, WhatsApp support, and a separate Google review sheet.",
  alternates: { canonical: "/docforclient" },
  robots: { index: false, follow: false },
};

const qrOptions = {
  width: 640,
  margin: 2,
  errorCorrectionLevel: "H" as const,
  color: { dark: "#06241B", light: "#FFFFFF" },
};

export default async function DocForClientPage() {
  const [guestQrDataUrl, reviewsQrDataUrl] = await Promise.all([
    QRCode.toDataURL(qrLandingUrl, qrOptions),
    QRCode.toDataURL(reviewsUrl, qrOptions),
  ]);

  return (
    <main id="content" className="docforclient-page min-h-[100svh] bg-[#E6EFE3] px-4 py-10 print:bg-white print:py-0 sm:px-6">
      <div className="mx-auto max-w-[1100px]">
        <p className="mb-6 text-center text-sm text-[#0B3D2E]/80 print:hidden">
          Two printable sheets — guest hub + Google reviews. Use <strong>Print handout</strong> for both pages.
        </p>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-8">
          <HandoutCard
            className="docforclient-sheet"
            badge="Guest QR experience"
            title="Scan for photos, giveaways & support"
            subtitle="Place near your Visriva station. Guests scan once — no app install."
            qrDataUrl={guestQrDataUrl}
            urlLabel={qrLandingUrl.replace(/^https?:\/\//, "")}
            qrAlt={`QR code linking to ${qrLandingUrl}`}
            steps={[
              { n: "01", title: "Weekly giveaway", body: "Tag @visriva.co and enter in seconds." },
              { n: "02", title: "Event photos", body: "View & download with your event password." },
              { n: "03", title: "Soft copy & edits", body: "WhatsApp us from the same page." },
            ]}
          />

          <HandoutCard
            className="docforclient-sheet"
            badge="Google reviews"
            title="Loved the experience? Scan to review us on Google"
            subtitle="Opens our review studio on visriva.com — then continues to Google in one tap."
            qrDataUrl={reviewsQrDataUrl}
            urlLabel={reviewsUrl.replace(/^https?:\/\//, "")}
            qrAlt={`QR code linking to ${reviewsUrl}`}
            steps={[
              { n: "01", title: "Pick a theme", body: "Crew, photo quality, or guest experience." },
              { n: "02", title: "Open Google", body: "Secure window — not an embedded iframe." },
              { n: "03", title: "Under a minute", body: "A quick review helps the next host find us." },
            ]}
          />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
          <DocForClientPrintButton />
          <a
            href="/qr"
            className="inline-flex min-h-11 items-center rounded-full border-2 border-[#0B3D2E] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#0B3D2E]"
          >
            Guest QR page ↗
          </a>
          <a
            href="/reviews"
            className="inline-flex min-h-11 items-center rounded-full border-2 border-[#0B3D2E] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#0B3D2E]"
          >
            Review studio ↗
          </a>
        </div>
      </div>
    </main>
  );
}

function HandoutCard({
  badge,
  title,
  subtitle,
  qrDataUrl,
  urlLabel,
  qrAlt,
  steps,
  className = "",
}: {
  badge: string;
  title: string;
  subtitle: string;
  qrDataUrl: string;
  urlLabel: string;
  qrAlt: string;
  steps: { n: string; title: string; body: string }[];
  className?: string;
}) {
  return (
    <article
      className={`overflow-hidden rounded-[2rem] border-2 border-[#C9A227] bg-[#07291E] shadow-[0_24px_70px_rgba(0,0,0,.35)] print:rounded-none print:border-[#C9A227] print:shadow-none ${className}`}
    >
      <header className="border-b border-[#C9A227]/35 px-6 py-8 text-center sm:px-8">
        <div className="mx-auto flex max-w-sm items-center justify-center gap-3">
          <Image src="/brand/visriva-logo.png" alt="" width={48} height={48} className="h-12 w-12 object-contain" />
          <div className="text-left">
            <p className="font-display text-2xl tracking-wide text-[#E8D48A]">visriva</p>
            <p className="font-royal text-[0.5rem] uppercase tracking-[0.26em] text-white/80">{badge}</p>
          </div>
        </div>
        <h1 className="mt-5 font-display text-2xl leading-tight text-white sm:text-[1.65rem]">{title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/85">{subtitle}</p>
      </header>

      <div className="flex flex-col items-center bg-white px-6 py-8 sm:px-8">
        <div className="rounded-3xl border-4 border-[#C9A227] bg-white p-3 shadow-lg print:border-[#C9A227] print:shadow-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} width={280} height={280} alt={qrAlt} className="h-auto w-[min(62vw,280px)] max-w-full" />
        </div>
        <p className="mt-5 text-center font-display text-2xl tracking-tight text-[#0B3D2E] sm:text-3xl">{urlLabel}</p>
        <p className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#947D34]">Point your camera here</p>
      </div>

      <ul className="grid gap-3 border-t border-[#C9A227]/30 px-6 py-6 text-sm text-white/90 sm:px-8">
        {steps.map((step) => (
          <li key={step.n} className="rounded-2xl border border-white/15 bg-white/5 p-3.5">
            <p className="font-royal text-[0.5rem] uppercase tracking-[0.2em] text-[#E8D48A]">{step.n}</p>
            <p className="mt-1.5 font-semibold text-white">{step.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/75">{step.body}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}