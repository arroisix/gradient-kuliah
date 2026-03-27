// Kuliah Landing Page - Revamp
import Navbar from 'landing/components/Sections/kuliah/Navbar';
import HeroSection from 'landing/components/Sections/kuliah/HeroSection';
import BenefitSection from 'landing/components/Sections/kuliah/BenefitSection';
import TestimonySection from 'landing/components/Sections/kuliah/TestimonySection';
import PlaystoreSection from 'landing/components/Sections/kuliah/PlaystoreSection';
import OtherProductsSection from 'landing/components/Sections/kuliah/OtherProductsSection';
import PricingSection from 'landing/components/Sections/kuliah/PricingSection';
import CTASection from 'landing/components/Sections/kuliah/CTASection';
import Footer from 'landing/components/Sections/kuliah/Footer';

const LandingContainer = ({
    classesData,
    popularBooksData,
    pricingData
}: LandingContainerProps): JSX.Element => {
    // Props will be used when API integration is completed
    return (
        <div className="bg-black min-h-screen">
            <Navbar />
            <HeroSection />
            <BenefitSection />
            <TestimonySection />
            <PlaystoreSection />
            <PricingSection />
            <CTASection />
            <OtherProductsSection />
            <Footer />
        </div>
    );
};

export default LandingContainer;
