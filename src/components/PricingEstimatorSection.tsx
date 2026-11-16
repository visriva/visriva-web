import PricingEstimator, { type PricingEstimatorStation } from "@/components/PricingEstimator";

type PricingEstimatorSectionProps = {
  defaultStation?: PricingEstimatorStation;
};

export function PricingEstimatorSection({ defaultStation }: PricingEstimatorSectionProps) {
  return (
    <section
      aria-labelledby="package-estimator-heading"
      className="border-t border-[#CBDCC7] bg-[#E7EFE3] px-5 py-16 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-[900px] text-center">
        <p className="section-kicker">Package builder</p>
        <h2 id="package-estimator-heading" className="display-heading mt-4 text-4xl text-[#244936] sm:text-5xl">
          Calculate your <em className="gold-gradient not-italic">event package</em>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#617768] sm:text-base">
          Get an instant estimate and send it to us on WhatsApp in one click.
        </p>
      </div>
      <PricingEstimator defaultStation={defaultStation} embedded />
    </section>
  );
}