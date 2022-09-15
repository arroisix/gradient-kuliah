import Layout from 'commons/layout';
import { GetStaticProps } from 'next';
import DetailCourse from 'courses/containers/detail';
import { wrapper } from 'redux/store';
import {
    getPublicCourse,
    useGetPublicCourseQuery,
    useGetPublicListCoursesQuery
} from 'courses/redux/api/publicCourseApi';
import { getRunningOperationPromises } from 'redux/api/baseApi';

const DetailKelas = ({ id }: { id: string }): JSX.Element => {
    const { data: courses } = useGetPublicListCoursesQuery(
        {} as FilterCourseQueryParams
    );
    const { data: course } = useGetPublicCourseQuery(id);

    return (
        <Layout courses={courses?.data} shouldTransparent>
            <DetailCourse course={course ? course : ({} as Course)} />
        </Layout>
    );
};

export default DetailKelas;

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    ({ dispatch }) =>
        async () => {
            await dispatch<any>(getPublicCourse.initiate('kalkulus1'));

            Promise.all(getRunningOperationPromises());

            return {
                props: {
                    id: 'kalkulus1'
                }
            };
        }
);
