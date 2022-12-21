import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import { cloneElement } from 'react';
import { useSelector } from 'react-redux';
import CatalogSection from './Common/CatalogSection';
import FAQSection from './Common/FAQSection';
import HeroSection from './Common/HeroSection';
import Lecturer from './Common/LecturerSection';
import PosterSection from './Common/PosterSection';
import PriceHighlightSection from './Common/PriceHighlightSection';
import TestimonySection from './Common/TestimonySection';
import VideoSection from './Common/VideoSection';
import BenefitKalkulus1Section from './Kalkulus1/BenefitKalkulus1Section';
import PriceHighlightKalkulus1Section from './Kalkulus1/PriceHighlightKalkulus1Section';
import SubscriptionBanner from './Common/SubscriptionBanner';
import HeroPTSLSection from './PTSL/HeroPTSLSection';
import PosterKalkulus1Section from './Kalkulus1/PosterKalkulus1Section';
import BenefitPTSLSection from './PTSL/BenefitPTSLSection';
import PriceHighlightPTSLSection from './PTSL/PriceHighlightPTSLSection';

const COMPONENT_DICTIONARY: { [key in LandingPageSectionKey]: JSX.Element } = {
    hero: <HeroSection slug="dummy" />,
    video: <VideoSection slug="dummy" />,
    benefit: <></>,
    lecturers: <Lecturer slug="dummy" />,
    price_table: <SubscriptionBanner slug="dummy" />,
    testimony: <TestimonySection />,
    price_highlight: <PriceHighlightSection slug="dummy" />,
    faq: <FAQSection />,
    poster: <PosterSection slug="dummy" />,
    price_highlight_kalkulus1: <PriceHighlightKalkulus1Section slug="dummy" />,
    price_highlight_ptsl: <PriceHighlightPTSLSection slug="dummy" />,
    benefit_kalkulus1: <BenefitKalkulus1Section />,
    benefit_ptsl: <BenefitPTSLSection />,
    poster_kalkulus1: <PosterKalkulus1Section slug="dummy" />,
    hero_ptsl: <HeroPTSLSection slug="dummy" />
};

const AuthLandingPage = ({ id }: { id: string }): JSX.Element => {
    const { data: course, isLoading } = useGetLandingCourseDataQuery(id);
    const { is_subscribed } = useCourseSubscription(id);

    if (isLoading || !course) {
        return <LoadingBackdrop />;
    }

    return (
        <section>
            {cloneElement(
                COMPONENT_DICTIONARY[
                    course?.configuration?.landing_page_section[0].key
                ],
                {
                    ...course?.configuration?.landing_page_section[0],
                    slug: id
                }
            )}
            {!is_subscribed ? (
                <>
                    {course?.configuration?.landing_page_section
                        .slice(1)
                        .map((section: LandingPageSection) =>
                            cloneElement(COMPONENT_DICTIONARY[section.key], {
                                ...section,
                                slug: id
                            })
                        )}
                </>
            ) : (
                <CatalogSection
                    id={course.course_id}
                    slug={course.course_slug}
                />
            )}
        </section>
    );
};

const LandingPageOrchestrator = ({ id }: { id: string }): JSX.Element => {
    const { data: course } = useGetLandingCourseDataQuery(id);
    const isAuthenticated = useSelector(getIsAuthenticated);

    if (isAuthenticated) {
        return <AuthLandingPage id={id} />;
    }

    return (
        <main>
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
