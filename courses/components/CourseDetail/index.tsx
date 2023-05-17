import CourseDescription from './CourseDescription';
import LearningProgress from './LearningProgress';
import Sylabbus from './Sylabbus';

const CourseDetail = ({ slug }: GradientBaseComponentWithSlug): JSX.Element => {
    return (
        <main className="flex flex-col gap-16 mb-16">
            <LearningProgress slug={slug} />
            <div className="flex flex-col lg:items-start lg:flex-row-reverse lg:justify-center">
                <CourseDescription slug={slug} />
                <Sylabbus slug={slug} />
            </div>
        </main>
    );
};

export default CourseDetail;
