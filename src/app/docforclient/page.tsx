import type { Metadata } from "next";
import Image from "next/image";
import QRCode from "qrcode";
import { DocForClientPrintButton } from "@/components/docforclient/DocForClientPrintButton";
import { siteUrl } from "@/lib/site";

const qrLandingUrl = `${siteUrl}/qr`;

export const metadata: Metadata = {
  title: "Guest QR handout",
  description: "Printable QR code for Visriva event guests — scan to enter the giveaway, request soft copies, and view event photos.",
  alternates: { canonical: "/docforclient" },
  robots: { index: false, follow: false },
};

export default async function DocForClientPage() {
  const qrDataUrl = await QRCode.toDataURL(qrLandingUrl, {
    width: 640,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: "#06241B", light: "#FFFFFF" },
  });

  return (
    <main id="content" className="docforclient-page min-h-[100svh] bg-[#E6EFE3] px-4 py-10 print:bg-white print:py-0 sm:px-6">
      <div className="mx-auto max-w-[720px]">
        <article className="overflow-hidden rounded-[2rem] border-2 border-[#C9A227] bg-[#07291E] shadow-[0_24px_70px_rgba(0,0,0,.35)] print:rounded-none print:border-[#C9A227] print:shadow-none">
          <header className="border-b border-[#C9A227]/35 px-6 py-8 text-center sm:px-10">
            <div className="mx-auto flex max-w-sm items-center justify-center gap-3">
              <Image src="/brand/visriva-logo.png" alt="" width={56} height={56} className="h-14 w-14 object-contain" />
              <div className="text-left">
                <p className="font-display text-3xl tracking-wide text-[#E8D48A]">visriva</p>
                <p className="font-royal text-[0.55rem] uppercase tracking-[0.28em] text-white/80">Guest QR experience</p>
              </div>
            </div>
            <h1 className="mt-6 font-display text-3xl leading-tight text-white sm:text-4xl">Scan for photos, giveaways &amp; support</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/85">
              Place this sheet near your Visriva station. Guests scan once — no app install needed.
            </p>
          </header>

          <div className="flex flex-col items-center bg-white px-6 py-10 sm:px-12">
            <div className="rounded-3xl border-4 border-[#C9A227] bg-white p-4 shadow-lg print:border-[#C9A227] print:shadow-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} width={320} height={320} alt={`QR code linking to ${qrLandingUrl}`} className="h-auto w-[min(72vw,320px)] max-w-full" />
            </div>
            <p className="mt-6 font-display text-4xl tracking-tight text-[#0B3D2E]">{qrLandingUrl.replace(/^https?:\/\//, "")}</p>
            <p className="mt-2 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#947D34]">Point your camera here</p>
          </div>

          <ul className="grid gap-4 border-t border-[#C9A227]/30 px-6 py-8 text-sm text-white/90 sm:grid-cols-3 sm:px-10">
            <li className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="font-royal text-[0.55rem] uppercase tracking-[0.2em] text-[#E8D48A]">01</p>
              <p className="mt-2 font-semibold text-white">Weekly giveaway</p>
              <p className="mt-1 text-xs leading-relaxed text-white/75">Tag @visriva.co and enter in seconds.</p>
            </li>
            <li className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="font-royal text-[0.55rem] uppercase tracking-[0.2em] text-[#E8D48A]">02</p>
              <p className="mt-2 font-semibold text-white">Event photos</p>
              <p className="mt-1 text-xs leading-relaxed text-white/75">View &amp; download with your event password.</p>
            </li>
            <li className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="font-royal text-[0.55rem] uppercase tracking-[0.2em] text-[#E8D48A]">03</p>
              <p className="mt-2 font-semibold text-white">Soft copy &amp; edits</p>
              <p className="mt-1 text-xs leading-relaxed text-white/75">WhatsApp us from the same page.</p>
            </li>
          </ul>
        </article>

        <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
          <DocForClientPrintButton />
          <a
            href="/qr"
            className="inline-flex min-h-11 items-center rounded-full border-2 border-[#0B3D2E] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#0B3D2E]"
          >
            Open live QR page ↗
          </a>
        </div>
      </div>
    </main>
  );
}