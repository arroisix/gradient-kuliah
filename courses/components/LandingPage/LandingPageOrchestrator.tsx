import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import CourseDetail from '../CourseDetail';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Pricing from 'landing/components/Sections/Pricing';
import RelatedCoursesSection from '../RelatedCoursesSection';

const LandingPageOrchestrator = ({
    id,
    packetOffer,
    course,
    recommendations
}: {
    id: string;
    packetOffer: PacketOffer[];
    course: CourseLandingPageData;
    recommendations: GetCourseRecommendationResponse;
}): JSX.Element => {
    const { is_subscribed, isDoneFetchingSubcription } =
        useCourseSubscription();
    const isAuthenticated = useSelector(getIsAuthenticated);
    return (
        <>
            <CourseDetail ssrCourse={course} slug={id} />
            {(!is_subscribed && isDoneFetchingSubcription) ||
            !isAuthenticated ? (
                <Pricing
                    pricingData={packetOffer}
                    ctaEventName="Pricing Button on Course Landing Page"
                />
            ) : (
                <></>
            )}
            <div>
                <RelatedCoursesSection
                    title={`Kelas Terkait '${course.course_name}'`}
                    courses={recommendations?.related_courses}
                />
                <RelatedCoursesSection
                    title="Eksplor Kelas Lainnya"
                    courses={recommendations?.other_courses}
                />
            </div>
        </>
    );
};

export default LandingPageOrchestrator;
