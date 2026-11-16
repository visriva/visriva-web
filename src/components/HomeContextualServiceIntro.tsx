import Link from "next/link";

export function HomeContextualServiceIntro() {
  return (
    <section aria-label="Live stations in Bengaluru" className="border-y border-[#CBDAC6] bg-[#F8F7EF]/90 px-5 py-8 sm:px-8 lg:px-12">
      <p className="mx-auto max-w-3xl text-center text-base leading-8 text-[#617768] sm:text-lg">
        Visriva Live Station provides experiential engagement across Bengaluru, including our high-speed{" "}
        <Link href="/services/photo-booth" className="font-medium text-[#5C7A35] underline decoration-[#C9A227]/50 underline-offset-4 transition hover:text-[#244936]">
          Photo Booth Rental
        </Link>
        , custom{" "}
        <Link href="/services/magnet-station" className="font-medium text-[#5C7A35] underline decoration-[#C9A227]/50 underline-offset-4 transition hover:text-[#244936]">
          Live Fridge Magnet Stations
        </Link>
        , and branded{" "}
        <Link href="/services/tote-tshirt-station" className="font-medium text-[#5C7A35] underline decoration-[#C9A227]/50 underline-offset-4 transition hover:text-[#244936]">
          Tote Bag &amp; T-Shirt Printing
        </Link>
        .
      </p>
    </section>
  );
}