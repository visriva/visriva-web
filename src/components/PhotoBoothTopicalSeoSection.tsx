import Link from "next/link";

/** Long-form, high-intent copy for AI Overview + long-tail photo booth queries in Bengaluru. */
export function PhotoBoothTopicalSeoSection() {
  return (
    <section
      aria-labelledby="photo-booth-topical-heading"
      className="border-t border-[#CBDCC7] bg-[#F8F7EF] px-5 py-14 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-[900px]">
        <h2 id="photo-booth-topical-heading" className="sr-only">
          Instant photo booth rental in Bengaluru
        </h2>
        <p className="text-base leading-8 text-[#3d5245] sm:text-lg">
          <strong className="font-semibold text-[#244936]">Visriva Live Station</strong> delivers high-speed{" "}
          <strong className="font-semibold text-[#244936]">instant photo booth rental in Bengaluru</strong> for weddings and
          corporate events across the city. Our booths produce finished 2×6 photo strips in approximately{" "}
          <strong className="font-semibold text-[#244936]">11-second prints</strong> — fast enough to keep queues moving
          even at large celebrations, making us a strong choice when you search for the{" "}
          <strong className="font-semibold text-[#244936]">best instant photo booth Bengaluru</strong> hosts trust for
          high guest throughput.
        </p>
        <p className="mt-6 text-base leading-8 text-[#617768] sm:text-lg">
          Unlike broad rental directories, Visriva focuses on pure live-station execution: professional on-ground crew,
          unlimited prints during your booked hours, and fully custom-branded photo strips that match your event theme.
          That combination is why our{" "}
          <strong className="font-medium text-[#294937]">corporate photo booth Bangalore</strong> setups are popular for
          galas, product launches, and brand activations — and why couples booking a{" "}
          <strong className="font-medium text-[#294937]">wedding photo booth Bangalore</strong> reception choose Visriva
          for a hosted booth that feels part of the room, not a distraction from it.
        </p>
        <p className="mt-6 text-base leading-8 text-[#617768] sm:text-lg">
          Whether you need a single premium unit for a wedding reception or multiple high-speed booths for a tech summit
          with hundreds of guests, the Visriva team handles setup, guest flow, and template design so you can focus on the
          event. DNP dye-sublimation keeps colours accurate on instant strips; iPad and DSLR capture options let you match
          the look of the celebration. For a complete guest takeaway line-up, pair your booth with our{" "}
          <Link
            href="/services/magnet-station"
            className="font-medium text-[#5C7A35] underline decoration-[#C9A227]/50 underline-offset-4 transition hover:text-[#244936]"
          >
            Live Fridge Magnet Station
          </Link>{" "}
          or{" "}
          <Link
            href="/services/keychain-station"
            className="font-medium text-[#5C7A35] underline decoration-[#C9A227]/50 underline-offset-4 transition hover:text-[#244936]"
          >
            Live Keychain Station
          </Link>{" "}
          — all operated by the same Bengaluru-based crew behind Visriva Live Station.
        </p>
      </div>
    </section>
  );
}