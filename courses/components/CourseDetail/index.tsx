import CourseDescription from './CourseDescription';
import ExpiryAnnouncement from './ExpiryAnnouncement';
import LearningProgress from './LearningProgress';
import Sylabbus from './Sylabbus';
import { CourseSubchapterSearchProvider } from 'courses/hooks/useSearchSubchapter';

const CourseDetail = ({ slug }: GradientBaseComponentWithSlug): JSX.Element => {
    return (
        <main className="flex flex-col gap-8 pb-16">
            <LearningProgress slug={slug} />
            <ExpiryAnnouncement slug={slug} />
            <div className="flex flex-col gap-8 lg:items-start lg:flex-row-reverse lg:justify-center lg:gap-0">
                <CourseDescription slug={slug} />
                <CourseSubchapterSearchProvider>
                    <Sylabbus slug={slug} />
                </CourseSubchapterSearchProvider>
            </div>
        </main>
    );
};

export default CourseDetail;
