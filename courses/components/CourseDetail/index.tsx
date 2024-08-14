import CourseDescription from './CourseDescription';
import ExpiryAnnouncement from './ExpiryAnnouncement';
import LearningProgress from './LearningProgress';
import Sylabbus from './Sylabbus';
import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import { CourseSubchapterSearchProvider } from 'courses/hooks/useSearchSubchapter';

const CourseDetail = ({
    slug,
    ssrCourse
}: Pick<GradientBaseComponentWithSlug, 'slug'> & {
    ssrCourse: CourseLandingPageData;
}): JSX.Element => {
    const { data } = useGetLandingCourseDataQuery(slug);
    const course = data ?? ssrCourse

    return (
        <main className="flex flex-col gap-8 pb-16">
            <LearningProgress course={course} slug={slug} />
            <ExpiryAnnouncement slug={slug} />
            <div className="flex flex-col gap-8 lg:items-start lg:flex-row-reverse lg:justify-center lg:gap-0">
                <CourseDescription course={course} slug={slug} />
                <CourseSubchapterSearchProvider>
                    <Sylabbus slug={slug} />
                </CourseSubchapterSearchProvider>
            </div>
        </main>
    );
};

export default CourseDetail;
