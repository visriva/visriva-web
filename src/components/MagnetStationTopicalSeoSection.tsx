import Link from "next/link";

export function MagnetStationTopicalSeoSection() {
  return (
    <section aria-labelledby="magnet-topical-heading" className="border-t border-[#CBDCC7] bg-[#F8F7EF] px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        <h2 id="magnet-topical-heading" className="sr-only">
          Live fridge magnet station Bengaluru
        </h2>
        <p className="text-base leading-8 text-[#3d5245] sm:text-lg">
          <strong className="font-semibold text-[#244936]">Visriva Live Station</strong> runs a{" "}
          <strong className="font-semibold text-[#244936]">live fridge magnet station</strong> built for weddings,
          receptions, and corporate celebrations across Bengaluru. Guests pose for candid portraits; our crew prints onto
          high-grade magnetic sheets, trims each piece, and displays finished magnets on a live pickup wall — the same
          workflow event planners search for when comparing{" "}
          <strong className="font-semibold text-[#244936]">live fridge magnet stall cost</strong> options in Bangalore.
        </p>
        <p className="mt-6 text-base leading-8 text-[#617768] sm:text-lg">
          Every activation includes dedicated on-ground staff, professional DSLR capture, custom event branding frames,
          and high-speed magnet printers sized for 200–800 guest evenings. Whether you are planning a destination-style
          wedding in Whitefield or a brand gala in central Bengaluru, Visriva&apos;s magnet station keeps queues short and
          output consistent — a practical alternative to generic{" "}
          <strong className="font-medium text-[#294937]">photo magnet booth Bangalore</strong> rentals that ship pre-made
          stock instead of printing live.
        </p>
        <p className="mt-6 text-base leading-8 text-[#617768] sm:text-lg">
          Pair magnets with our{" "}
          <Link href="/services/photo-booth" className="font-medium text-[#5C7A35] underline decoration-[#C9A227]/50 underline-offset-4 hover:text-[#244936]">
            Instant Photo Booth Rental Bengaluru
          </Link>{" "}
          for capture-to-keepsake flow, or add a{" "}
          <Link href="/services/keychain-station" className="font-medium text-[#5C7A35] underline decoration-[#C9A227]/50 underline-offset-4 hover:text-[#244936]">
            Live Keychain Station
          </Link>{" "}
          so guests choose between fridge magnets and premium acrylic keychains — all hosted by the Visriva Live Station
          team operating across Karnataka and nearby destinations such as Mysore and Chikmagalur.
        </p>
      </div>
    </section>
  );
}