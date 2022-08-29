import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseDetail from 'courses/hooks/useCourseDetail';
import { useSelector } from 'react-redux';
import About from './about';
import Benefit from './benefit';
import Catalog from './catalog';
import Faq from './faq';
import Hero from './hero';
import Lecturer from './lecturer';

const AuthDetailCourse = ({ course }: { course: Course }): JSX.Element => {
    const { loading, data } = useCourseDetail(course.slug);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <section>
            <Hero course={data as Course} />
            {!data?.is_subscribed ? (
                <>
                    <About course={data as Course} />
                    <Lecturer course={data as Course} />
                    <Benefit />
                    <Faq />
                </>
            ) : (
                <Catalog course={data as Course} />
            )}
        </section>
    );
};

const DetailCourse = ({ course }: { course: Course }): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);

    if (isAuthenticated) {
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
