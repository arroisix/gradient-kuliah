import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import useCourseDetail from 'courses/hooks/useCourseDetail';
import { useSelector } from 'react-redux';
import About from './about';
import Benefit from './benefit';
import Catalog from './catalog';
import Faq from './faq';
import Hero from './hero';
import Lecturer from './lecturer';
import Price from './price';

const AuthDetailCourse = ({ course }: { course: Course }): JSX.Element => {
    const { loading, data } = useCourseDetail(course.slug);

    if (loading || !data) {
        return <LoadingBackdrop />;
    }

    return (
        <section>
            <Hero course={data as Course} />
            {!data?.is_subscribed ? (
                <>
                    <Benefit />
                    <About course={data as Course} />
                    <Price course={course} />
                    <Lecturer course={data as Course} />
                    <Price course={course} />
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
            <Benefit />
            <Lecturer course={course} />
            <Price course={course} />
            <About course={course} />
            <Price course={course} />
            <Faq />
        </section>
    );
};

export default DetailCourse;
