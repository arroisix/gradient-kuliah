import Sidebar from 'commons/components/modules/Sidebar';
import CourseDescription from './CourseDescription';
import ExpiryAnnouncement from './ExpiryAnnouncement';
import LearningProgress from './LearningProgress';
import Sylabbus from './Sylabbus';

const CourseDetail = ({ slug }: GradientBaseComponentWithSlug): JSX.Element => {
    return (
        <main className="flex flex-col gap-16 mb-16">
            <LearningProgress slug={slug} />
            <ExpiryAnnouncement slug={slug} />
            <div className="flex flex-col lg:items-start lg:flex-row-reverse lg:justify-center gap-8 lg:gap-0">
                <CourseDescription slug={slug} />
                <Sylabbus slug={slug} />
                <Sidebar className="!hidden lg:!block top-[90px] rounded" />
            </div>
        </main>
    );
};

export default CourseDetail;
