import { GetServerSideProps } from 'next';
import { wrapper } from 'redux/store';
import dynamic from 'next/dynamic';
import { getRunningQueriesThunk } from 'redux/api/baseApi';
import { getExerciseDetail } from '../../../courses/redux/api/exercisesApi';

const ExerciseStartContent = dynamic(
    () =>
        import(
            '../../../courses/components/Latihan/ExerciseStart/ExerciseStartContent'
        ),
    { ssr: false }
);

const ExerciseStartPage = (): JSX.Element => {
    return <ExerciseStartContent />;
};

export const getServerSideProps: GetServerSideProps =
    wrapper.getServerSideProps((store) => async (context) => {
        const { slug } = context.params as { slug: string };

        await store.dispatch(
            getExerciseDetail.initiate({ exercise_slug: slug }) as any
        );

        await Promise.all(store.dispatch(getRunningQueriesThunk() as any));

        return {
            props: {
                canonical: `https://gradient.academy/latihan/${slug}`,
                title: 'Start Exercise - Gradient Academy',
                description: 'Start your exercise'
            }
        };
    });

ExerciseStartPage.displayName = 'ExerciseStart';
export default ExerciseStartPage;
