import CourseCard from "./CourseCard";

interface CourseListProps {
    courses: CourseV3[];
}

const CourseList = ({
    courses
}: CourseListProps): JSX.Element => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-8">
            {courses.map((course) => (
                <CourseCard key={course.id} {...course} />
            ))}
        </div>
    );
}

export default CourseList;