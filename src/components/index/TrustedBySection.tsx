
import { StatsCarousel } from "./trusted-by/StatsCarousel";
import { TrustedBySectionHeader } from "./trusted-by/TrustedBySectionHeader";

export const TrustedBySection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <TrustedBySectionHeader />
        <StatsCarousel isVisible={true} />
      </div>
    </section>
  );
};
