import Layout from 'src/commons/layout';
import { GetStaticProps, GetStaticPaths } from 'next';
import { publicClient } from 'src/commons/apolloClient';
import {
    GET_PUBLIC_COURSE,
    GET_PUBLIC_DETAIL_COURSE
} from 'src/courses/schema';
import VideoLearnContainer from 'src/courses/containers/learn/video';
import NotebookLearnContainer from 'src/courses/containers/learn/notebook';
import { useRouter } from 'next/router';
import { LearningProvider } from 'src/courses/contexts/LearningProvider';

const Belajar = ({ course }: { course: Course }): JSX.Element => {
    const router = useRouter();
    const { type } = router.query;

    const renderPage = (): JSX.Element => {
        if (type === 'video') {
            return <VideoLearnContainer course={course} />;
        }

        if (type === 'notebook') {
            return <NotebookLearnContainer course={course} />;
        }

        return <></>;
    };

    return (
        <LearningProvider course={course}>
            <Layout>{renderPage()}</Layout>
        </LearningProvider>
    );
};

export default Belajar;

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
            id: params?.id
        }
    });
    const course = resDetail.data.course;

    return {
        props: {
            course
        }
    };
};
