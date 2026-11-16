import Link from "next/link";

export function MugPrintingTopicalSeoSection() {
  return (
    <section aria-labelledby="mug-topical-heading" className="border-t border-[#CBDCC7] bg-[#F8F7EF] px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        <h2 id="mug-topical-heading" className="sr-only">
          Live mug printing station Bengaluru
        </h2>
        <p className="text-base leading-8 text-[#3d5245] sm:text-lg">
          <strong className="font-semibold text-[#244936]">Visriva Live Station</strong> operates a{" "}
          <strong className="font-semibold text-[#244936]">live mug printing station</strong> for corporate milestones,
          VIP wedding favors, and experiential giveaways across Bengaluru. Guests select photos, logos, or campaign
          creative; our sublimation line prints and heat-presses ceramic mugs on-site — the high-value format planners
          book when searching{" "}
          <strong className="font-semibold text-[#244936]">mug printing station Bangalore</strong> and{" "}
          <strong className="font-semibold text-[#244936]">personalized mugs event activation</strong> options that feel
          premium, not promotional.
        </p>
        <p className="mt-6 text-base leading-8 text-[#617768] sm:text-lg">
          We use professional coatings and commercial heat presses so prints stay vibrant and durable — suitable for
          daily use after the event. Hosted crew guides design choices, manages queue flow, and aligns mug artwork with
          your brand book, making our setup a natural fit for{" "}
          <strong className="font-medium text-[#294937]">corporate event gifting mug printing</strong> at launches,
          leadership offsites, and employee engagement days throughout Bangalore and Whitefield corridors.
        </p>
        <p className="mt-6 text-base leading-8 text-[#617768] sm:text-lg">
          Extend the activation with{" "}
          <Link href="/services/tote-tshirt-station" className="font-medium text-[#5C7A35] underline decoration-[#C9A227]/50 underline-offset-4 hover:text-[#244936]">
            Live Tote Bag &amp; T-Shirt Printing
          </Link>{" "}
          for wearable gifts, or{" "}
          <Link href="/services/magnet-station" className="font-medium text-[#5C7A35] underline decoration-[#C9A227]/50 underline-offset-4 hover:text-[#244936]">
            Live Fridge Magnet Station
          </Link>{" "}
          keepsakes guests display at home. Visriva Live Station handles logistics, power, and teardown so your team
          focuses on the celebration.
        </p>
      </div>
    </section>
  );
}