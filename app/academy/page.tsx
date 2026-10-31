import AcademyNav from "./components/AcademyNav";
import HeroSection from "./components/HeroSection";
import MissionSection from "./components/MissionSection";
import MasterySection from "./components/MasterySection";
import AccessSection from "./components/AccessSection";
import HabitSection from "./components/HabitSection";
import ProductsSection from "./components/ProductsSection";
import { AcademyFooter, CtaSection } from "./components/CtaFooter";

// gradient.academy – umbrella landing page in the new Gamification x Mastery UI.
export default function AcademyPage() {
  return (
    <main className="min-h-screen overflow-x-clip">
      <AcademyNav />
      <HeroSection />
      <MissionSection />
      <MasterySection />
      <AccessSection />
      <HabitSection />
      <ProductsSection />
      <CtaSection />
      <AcademyFooter />
    </main>
  );
}
