import { GetStaticProps } from 'next';
import Layout from 'commons/layout';
import LandingContainer from 'landing/containers';
import {
    getPublicListCourses,
    useGetPublicListCoursesQuery
} from 'courses/redux/api/publicCourseApi';
import { getRunningOperationPromises } from 'redux/api/baseApi';
import { wrapper } from 'redux/store';
import withAnon from 'commons/withAnon';

const Home = (): JSX.Element => {
    const { data: courses } = useGetPublicListCoursesQuery(
        {} as FilterCourseQueryParams
    );

    return (
        <Layout shouldTransparent courses={courses?.data}>
            <LandingContainer />
        </Layout>
    );
};

export default withAnon(Home);

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    ({ dispatch }) =>
        async () => {
            await dispatch<any>(
                getPublicListCourses.initiate({} as FilterCourseQueryParams)
            );

            Promise.all(getRunningOperationPromises());

            return {
                props: {}
            };
        }
);
