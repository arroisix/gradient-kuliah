import Layout from 'commons/layout';
import { GetStaticProps, GetStaticPaths } from 'next';
import VideoLearnContainer from 'courses/containers/learn/video';
import NotebookLearnContainer from 'courses/containers/learn/notebook';
import { useRouter } from 'next/router';
import { LearningProvider } from 'courses/contexts/LearningProvider';
import config from 'redux/api/config';
import { wrapper } from 'redux/store';
import {
    getPublicCourse,
    useGetPublicCourseQuery
} from 'courses/redux/api/publicCourseApi';
import { getRunningOperationPromises } from 'redux/api/baseApi';

const Belajar = ({ id }: { id: string }): JSX.Element => {
    const router = useRouter();
    const { type } = router.query;
    const { data: course } = useGetPublicCourseQuery(id);

    const renderPage = (): JSX.Element => {
        if (type === 'video') {
            return (
                <VideoLearnContainer
                    course={course ? course : ({} as Course)}
                />
            );
        }

        if (type === 'notebook') {
            return (
                <NotebookLearnContainer
                    course={course ? course : ({} as Course)}
                />
            );
        }

        return <></>;
    };

    return (
        <LearningProvider course={course ? course : ({} as Course)}>
            <Layout>{renderPage()}</Layout>
        </LearningProvider>
    );
};

export default Belajar;

export const getStaticPaths: GetStaticPaths = async () => {
    const result = await fetch(`${config.API_BASE_URL}courses/public`);

    const paths = (await result.json()) as ResponseData<Course>;

    const ids = paths.data.map((course: Course) => ({
        params: {
            id: course.id
        }
    }));

    return { paths: ids, fallback: false };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    ({ dispatch }) =>
        async ({ params }) => {
            await dispatch<any>(getPublicCourse.initiate(params?.id as string));

            Promise.all(getRunningOperationPromises());

            return {
                props: {
                    id: params?.id
                }
            };
        }
);
