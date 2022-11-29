import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import { cloneElement } from 'react';
import FAQSection from './Common/FAQSection';
import HeroSection from './Common/HeroSection';
import Lecturer from './Common/LecturerSection';
import PriceHighlightSection from './Common/PriceHighlightSection';
import TestimonySection from './Common/TestimonySection';
import PriceHighlightKalkulus1Section from './Kalkulus1/PriceHighlightKalkulus1Section';

const COMPONENT_DICTIONARY: { [key in LandingPageSectionKey]: JSX.Element } = {
    hero: <HeroSection slug="dummy" />,
    video: <></>,
    benefit: <></>,
    lecturers: <Lecturer slug="dummy" />,
    price_table: <></>,
    testimony: <TestimonySection />,
    price_highlight: <PriceHighlightSection slug="dummy" />,
    faq: <FAQSection />,
    price_highlight_kalkulus1: <PriceHighlightKalkulus1Section slug="dummy" />
};

const LandingPageOrchestrator = ({ id }: { id: string }): JSX.Element => {
    const { data: course } = useGetLandingCourseDataQuery(id);

    return (
        <main className="pt-[70px]">
            {course?.configuration?.landing_page_section.map(
                (section: LandingPageSection) =>
                    cloneElement(COMPONENT_DICTIONARY[section.key], {
                        ...section,
                        slug: id
                    })
            )}
        </main>
    );
};

export default LandingPageOrchestrator;
