import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import BenefitSection from "./components/BenefitSection";
import TestimonySection from "./components/TestimonySection";
import PricingSection from "./components/PricingSection";
import CTASection from "./components/CTASection";
import OtherProductsSection from "./components/OtherProductsSection";
import Footer from "./components/Footer";
import PlaystoreSection from "./components/PlaystoreSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-black">
      <Navbar />

      {/* No wrapper padding - HeroSection has pt-24 for floating navbar */}
      <HeroSection />
      <BenefitSection />
      <PlaystoreSection />

      <TestimonySection />
      <PricingSection />
      <CTASection />
      <OtherProductsSection />
      <Footer />
    </main>
  );
}
