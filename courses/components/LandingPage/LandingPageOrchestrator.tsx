import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import { cloneElement } from 'react';
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
import BenefitKalkulus2Section from './Kalkulus2/BenefitKalkulus2Section';
import PriceHighlightKalkulus2Section from './Kalkulus2/PriceHighlightKalkulus2Section';
import PriceHighlightStatprobSection from './Statprob/PriceHighlightStaprobSection';
import BenefitStatprobSection from './Statprob/BenefitStatprobSection';
import CourseDetail from '../CourseDetail';
import Pricing from 'landing/components/OldSections/pricing';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import Paywall from 'commons/components/elements/Paywall';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useRouter } from 'next/router';

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
    price_highlight_kalkulus2: <PriceHighlightKalkulus2Section slug="dummy" />,
    price_highlight_statprob: <PriceHighlightStatprobSection slug="dummy" />,
    benefit_kalkulus1: <BenefitKalkulus1Section />,
    benefit_ptsl: <BenefitPTSLSection />,
    benefit_statprob: <BenefitStatprobSection />,
    benefit_kalkulus2: <BenefitKalkulus2Section />,
    poster_kalkulus1: <PosterKalkulus1Section slug="dummy" />,
    hero_ptsl: <HeroPTSLSection slug="dummy" />
};

export const AuthLandingPage = ({ id }: { id: string }): JSX.Element => {
    const { data: course, isLoading } = useGetLandingCourseDataQuery(id, {
        refetchOnMountOrArgChange: true
    });
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

const LandingPageOrchestrator = ({
    id,
    packetOffer
}: {
    id: string;
    packetOffer: PacketOffer[];
}): JSX.Element => {
    const router = useRouter();
    const { is_subscribed, isDoneFetchingSubcription } =
        useCourseSubscription();
    const { isDesktopBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    return (
        <>
            <CourseDetail slug={id} />
            {(!is_subscribed && isDoneFetchingSubcription) ||
            !isAuthenticated ? (
                isLandingPageRevampOn ? (
                    <div className="flex flex-col items-center justify-center w-screen sm:w-auto ">
                        <Paywall
                            pricingData={packetOffer}
                            isCarousel={!isDesktopBreakpoints}
                            redirect={router.asPath}
                            className="w-screen sm:w-auto"
                            highlightedClassName="!order-none"
                            pricingClassName="max-w-[18rem] sm:max-w-xs"
                            ctaEventName="Pricing Button on Course Landing Page"
                        />
                    </div>
                ) : (
                    <Pricing
                        pricingData={packetOffer}
                        ctaEventName="Pricing Button on Course Landing Page"
                        ctaEventPayload={{
                            'Course Slug': id,
                            Variant: 'JUN 2023'
                        }}
                    />
                )
            ) : (
                <></>
            )}
        </>
    );
};

export default LandingPageOrchestrator;
