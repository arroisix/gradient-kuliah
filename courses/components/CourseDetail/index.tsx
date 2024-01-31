import Sidebar from 'commons/components/modules/Sidebar';
import CourseDescription from './CourseDescription';
import ExpiryAnnouncement from './ExpiryAnnouncement';
import LearningProgress from './LearningProgress';
import Sylabbus from './Sylabbus';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { CourseSubchapterSearchProvider } from 'courses/hooks/useSearchSubchapter';

const CourseDetail = ({ slug }: GradientBaseComponentWithSlug): JSX.Element => {
    const { isAuthenticated } = useAuth();

    return (
        <main className="flex flex-col gap-16 mb-16">
            <LearningProgress slug={slug} />
            <ExpiryAnnouncement slug={slug} />
            <div className="flex flex-col gap-8 lg:items-start lg:flex-row-reverse lg:justify-center lg:gap-0">
                <CourseDescription slug={slug} />
                <CourseSubchapterSearchProvider>
                    <Sylabbus slug={slug} />
                </CourseSubchapterSearchProvider>
                {isAuthenticated && (
                    <Sidebar className="!hidden lg:!block top-[90px] rounded" />
                )}
            </div>
        </main>
    );
};

export default CourseDetail;
