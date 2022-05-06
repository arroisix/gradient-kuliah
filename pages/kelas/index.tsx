import Layout from 'commons/layout';
import ClassContainer from 'courses/containers';
import {
    getPublicListCourses,
    useGetPublicListCoursesQuery
} from 'courses/redux/api/publicCourseApi';
import { GetStaticProps } from 'next';
import { getRunningOperationPromises } from 'redux/api/baseApi';
import { wrapper } from 'redux/store';

const Kelas = (): JSX.Element => {
    const { data: courses } = useGetPublicListCoursesQuery(
        {} as FilterCourseQueryParams
    );

    return (
        <Layout courses={courses?.data}>
            <ClassContainer courses={courses?.data ?? []} />
        </Layout>
    );
};

export default Kelas;

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
