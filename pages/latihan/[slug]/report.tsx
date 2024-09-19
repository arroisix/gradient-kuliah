import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const ExerciseReportLayout = dynamic(
    () =>
        import(
            '../../../courses/components/Latihan/Report/ExerciseReportLayout'
        ),
    { ssr: false }
);

const ExerciseReportPage = () => {
    const router = useRouter();
    const { slug } = router.query;

    if (!slug) {
        return <div>Loading...</div>;
    }

    return <ExerciseReportLayout slug={slug as string} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };

    return {
        props: {
            slug
        }
    };
};

export default ExerciseReportPage;
