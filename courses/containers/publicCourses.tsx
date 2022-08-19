import CourseCard from '../components/CourseCard';
import CourseContainer from '../components/CourseContainer';
import { COMING_SOON_COURSE } from './privateCourses';

const PublicCourses = ({ courses }: { courses: Course[] }): JSX.Element => {
    return (
        <CourseContainer>
            {courses.map((course: Course) => (
                <CourseCard course={course} key={course.id} />
            ))}
            {COMING_SOON_COURSE.map((course) => (
                <CourseCard
                    course={course as unknown as Course}
                    key={course.thumbnail}
                />
            ))}
        </CourseContainer>
    );
};

export default PublicCourses;
