import CourseCard from './CourseCard';

interface CourseListProps {
    courses: CourseV3[];
    highlightQuery?: string;
}

const CourseList = ({
    courses,
    highlightQuery
}: CourseListProps): JSX.Element => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 w-full gap-6">
            {courses.map((course) => (
                <CourseCard
                    key={course.id}
                    {...course}
                    highlightQuery={highlightQuery}
                />
            ))}
        </div>
    );
};

export default CourseList;
