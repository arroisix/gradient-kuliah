import CourseCard from '../components/Card';
import CourseContainer from '../components/CourseContainer';

const PublicCourses = ({ courses }: { courses: Course[] }): JSX.Element => {
    return (
        <CourseContainer>
            {courses.map((course: Course) => (
                <CourseCard course={course} key={course.uuid} />
            ))}
        </CourseContainer>
    );
};

export default PublicCourses;
