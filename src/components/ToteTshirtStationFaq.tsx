import { TOTE_TSHIRT_STATION_FAQ } from "@/components/seo/ToteTshirtStationServiceJsonLd";

export function ToteTshirtStationFaq() {
  return (
    <section
      aria-labelledby="tote-tshirt-station-faq"
      className="border-t border-[#CBDCC7] bg-[#F5F0DF] px-5 py-16 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-[900px]">
        <p className="section-kicker">FAQ</p>
        <h2 id="tote-tshirt-station-faq" className="display-heading mt-4 text-4xl text-[#244936] sm:text-5xl">
          Live tote &amp; T-shirt <em className="gold-gradient not-italic">questions</em>
        </h2>
        <dl className="mt-10 space-y-8">
          {TOTE_TSHIRT_STATION_FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-display text-xl text-[#294937] sm:text-2xl">{item.question}</dt>
              <dd className="mt-2 text-sm leading-7 text-[#617768] sm:text-base">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}