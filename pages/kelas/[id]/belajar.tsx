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
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import { useGetPrivateCourseQuery } from 'courses/redux/api/privateCourseApi';
import withAuth from 'commons/withAuth';

const Belajar = ({ id }: { id: string }): JSX.Element => {
    const router = useRouter();
    const { type } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: publicCourse } = useGetPublicCourseQuery(id, {
        skip: isAuthenticated
    });
    const { data: privateCourse } = useGetPrivateCourseQuery(id, {
        skip: !isAuthenticated
    });

    const getCourse = (): Course => {
        if (isAuthenticated) {
            return privateCourse ?? ({} as Course);
        }
        return publicCourse ?? ({} as Course);
    };

    const renderPage = (): JSX.Element => {
        if (type === 'video') {
            return <VideoLearnContainer course={getCourse()} />;
        }

        if (type === 'notebook') {
            return <NotebookLearnContainer course={getCourse()} />;
        }

        return <></>;
    };

    return (
        <LearningProvider course={getCourse()}>
            <Layout>{renderPage()}</Layout>
        </LearningProvider>
    );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default withAuth(Belajar);

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

            Promise.all(getRunningOperationPromises());

            return {
                props: {
                    id: params?.id
                }
            };
        }
);
