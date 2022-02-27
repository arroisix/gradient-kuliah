import Layout from 'src/commons/layout';
import { GetStaticProps, GetStaticPaths } from 'next';
import { publicClient } from 'src/commons/apolloClient';
import {
    GET_PUBLIC_COURSE,
    GET_PUBLIC_DETAIL_COURSE
} from 'src/courses/schema';
import DetailCourse from 'src/courses/containers/detail';

const DetailKelas = ({
    course,
    courses
}: {
    course: Course;
    courses: [Course];
}): JSX.Element => {
    return (
        <Layout courses={courses} shouldTransparent>
            <DetailCourse course={course} />
        </Layout>
    );
};

export default DetailKelas;

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await publicClient.query({
        query: GET_PUBLIC_COURSE
    });
    const courses = data.allCourses.edges.map(
        (course: CourseNode) => course.node as Course
    );

    const paths = courses.map((course: Course) => ({
        params: { id: course.uuid }
    }));

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const resDetail = await publicClient.query({
        query: GET_PUBLIC_DETAIL_COURSE,
        variables: {
            ...params
        }
    });
    const course = resDetail.data.course;

    const resAll = await publicClient.query({
        query: GET_PUBLIC_COURSE
    });

    const courses = resAll.data.allCourses.edges.map(
        (course: CourseNode) => course.node as Course
    );

    return {
        props: {
            course,
            courses
        }
    };
};
