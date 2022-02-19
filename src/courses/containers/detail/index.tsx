import { useAuth } from 'src/authentication/contexts/AuthProvider';
import useCourseDetail from 'src/courses/hooks/courseDetail';
import About from './about';
import Benefit from './benefit';
import Faq from './faq';
import Hero from './hero';
import Lecturer from './lecturer';

const AuthDetailCourse = ({ course }: { course: Course }): JSX.Element => {
    const { loading, data } = useCourseDetail(course.uuid);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <section>
            <Hero course={data?.authCourse} />
            <About course={data?.authCourse} />
            <Lecturer course={data?.authCourse} />
            <Benefit />
            <Faq />
        </section>
    );
};

const DetailCourse = ({ course }: { course: Course }): JSX.Element => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated()) {
        return <AuthDetailCourse course={course} />;
    }

    return (
        <section>
            <Hero course={course} />
            <About course={course} />
            <Lecturer course={course} />
            <Benefit />
            <Faq />
        </section>
    );
};

export default DetailCourse;
