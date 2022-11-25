import Layout from 'commons/layout';
import { GetStaticProps, GetStaticPaths } from 'next';
// import DetailCourse from 'courses/containers/detail';
import { wrapper } from 'redux/store';
import {
    getLandingCourseData,
    useGetLandingCourseDataQuery
} from 'courses/redux/api/publicCourseApi';
import { getRunningOperationPromises } from 'redux/api/baseApi';
import config from 'redux/api/config';

const DetailKelas = ({ id }: { id: string }): JSX.Element => {
    // const { data: courses } = useGetPublicListCoursesQuery(
    //     {} as FilterCourseQueryParams
    // );
    const { data: course } = useGetLandingCourseDataQuery(id);

    console.log(course);

    return (
        <Layout shouldTransparent>
            <></>
            {/* <DetailCourse course={course ? course : ({} as Course)} /> */}
        </Layout>
    );
};

export default DetailKelas;

export const getStaticPaths: GetStaticPaths = async () => {
    const courseSlug = await fetch(
        `${config.API_BASE_URL}courses/public/landing/`
    );

    const result: ResponseData<string> = await courseSlug.json();

    return {
        paths: result.data.map((slug: string) => ({ params: { id: slug } })),
        fallback: false // can also be true or 'blocking'
    };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    ({ dispatch }) =>
        async ({ params }) => {
            await dispatch<any>(
                getLandingCourseData.initiate(params?.id as string)
            );

            Promise.all(getRunningOperationPromises());

            return {
                props: {
                    id: params?.id
                },
                revalidate: 300
            };
        }
);
