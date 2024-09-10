import LearnLayout from 'commons/learnLayout';
import { GetServerSideProps } from 'next';
import { wrapper } from 'redux/store';
import LatihanEntrypoint from '../../courses/containers/learn/latihan/entrypoint';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { getExerciseLandingPage } from '../../courses/redux/api/exercisesApi';

const LatihanPage = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <LatihanEntrypoint />
        </LearnLayout>
    );
};

export const getServerSideProps: GetServerSideProps =
    wrapper.getServerSideProps((store) => async (context) => {
        const {
            page = 1,
            status = 'all',
            subject = 'all',
            sort = 'latest'
        } = context.query;

        await store.dispatch(
            getExerciseLandingPage.initiate({
                page: Number(page),
                limit: 6,
                status: status as string,
                subject: subject as string,
                sort: sort as string
            }) as any
        );

        await Promise.all(store.dispatch(getRunningQueriesThunk() as any));

        return {
            props: {
                canonical: 'https://gradient.academy/latihan',
                title: 'Latihan - Gradient Academy',
                description:
                    'Latihan soal untuk meningkatkan pemahaman materi kuliah'
            }
        };
    });

LatihanPage.displayName = 'Latihan';
export default LatihanPage;
