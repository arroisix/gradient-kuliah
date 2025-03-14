import { NextPage } from 'next';
import { useRouter } from 'next/router';
import ExerciseReportLayout from 'exercises/components/Report/ExerciseReportLayout';
import withAuth from 'commons/withAuth';

const ExerciseReportPage: NextPage = () => {
    const router = useRouter();
    const { slug, exerciseProgressId } = router.query;

    if (!slug || !exerciseProgressId) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4 text-white">Loading...</p>
            </div>
        );
    }

    return (
        <ExerciseReportLayout
            slug={slug as string}
            exerciseProgressId={exerciseProgressId as string}
        />
    );
};

export default withAuth(ExerciseReportPage);
