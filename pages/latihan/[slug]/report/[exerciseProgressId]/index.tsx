import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const ExerciseReportLayout = dynamic(
    () =>
        import(
            '../../../../../courses/components/Latihan/Report/ExerciseReportLayout'
        ),
    { ssr: false }
);

const ExerciseReportPage = () => {
    const router = useRouter();
    const { slug, exerciseProgressId } = router.query;

    if (!slug || !exerciseProgressId) {
        return <div>Loading...</div>;
    }

    return (
        <ExerciseReportLayout
            slug={slug as string}
            exerciseProgressId={exerciseProgressId as string}
        />
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug, exerciseProgressId } = context.params as {
        slug: string;
        exerciseProgressId: string;
    };

    return {
        props: {
            slug,
            exerciseProgressId
        }
    };
};

export default ExerciseReportPage;
