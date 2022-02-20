import { GetStaticProps } from 'next';
import { publicClient } from 'src/commons/apolloClient';
import Layout from 'src/commons/layout';
import { GET_PUBLIC_COURSE } from 'src/courses/schema';
import LandingContainer from 'src/landing/containers';

export default function Home({ courses }: { courses: [Course] }): JSX.Element {
    return (
        <Layout shouldTransparent courses={courses}>
            <LandingContainer />
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const { data } = await publicClient.query({
        query: GET_PUBLIC_COURSE
    });

    return {
        props: {
            courses: data.allCourses.edges.map(
                (course: CourseNode) => course.node as Course
            )
        }
    };
};
