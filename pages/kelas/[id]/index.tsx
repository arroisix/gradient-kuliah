import Layout from 'commons/layout';
import { GetStaticProps, GetStaticPaths } from 'next';
import DetailCourse from 'courses/containers/detail';
import config from 'redux/api/config';
import { wrapper } from 'redux/store';
import {
    getPublicCourse,
    getPublicListCourses,
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

export const getStaticPaths: GetStaticPaths = async () => {
    const result = await fetch(`${config.API_BASE_URL}courses/public`);

    const paths = (await result.json()) as ResponseData<Course>;

    const ids = paths.data.map((course: Course) => ({
        params: {
            id: course.slug
        }
    }));

    return { paths: ids, fallback: false };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    ({ dispatch }) =>
        async ({ params }) => {
            await dispatch<any>(getPublicCourse.initiate(params?.id as string));
            await dispatch<any>(
                getPublicListCourses.initiate({} as FilterCourseQueryParams)
            );

            Promise.all(getRunningOperationPromises());

            return {
                props: {
                    id: params?.id
                }
            };
        }
);
