import Layout from 'src/commons/layout';
import { GetStaticProps, GetStaticPaths } from 'next';
import { publicClient } from 'src/commons/apolloClient';
import {
    GET_PUBLIC_COURSE,
    GET_PUBLIC_DETAIL_COURSE
} from 'src/courses/schema';
import DetailCourse from 'src/courses/containers/detail';

const DetailKelas = ({ course }: { course: Course }): JSX.Element => {
    return (
        <Layout shouldTransparent>
            <DetailCourse course={course} />
        </Layout>
    );
};

export default DetailKelas;

export const getStaticPaths: GetStaticPaths = async () => {
    // Call an external API endpoint to get posts
    const { data } = await publicClient.query({
        query: GET_PUBLIC_COURSE
    });
    const courses = data.allCourses.edges.map(
        (course: CourseNode) => course.node as Course
    );

    // Get the paths we want to pre-render based on posts
    const paths = courses.map((course: Course) => ({
        params: { id: course.uuid }
    }));

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { data } = await publicClient.query({
        query: GET_PUBLIC_DETAIL_COURSE,
        variables: {
            ...params
        }
    });

    return {
        props: {
            course: data.course
        }
    };
};
