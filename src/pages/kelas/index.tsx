import Layout from 'src/commons/layout';
import ClassContainer from 'src/courses/containers';
import { GetStaticProps } from 'next';
import { publicClient } from 'src/commons/apolloClient';
import { GET_PUBLIC_COURSE } from 'src/courses/schema';

const Kelas = ({ courses }: { courses: Course[] }): JSX.Element => {
    return (
        <Layout>
            <ClassContainer courses={courses} />
        </Layout>
    );
};

export default Kelas;

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
