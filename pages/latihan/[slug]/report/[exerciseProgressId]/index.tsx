import { NextPage } from 'next';
import { useRouter } from 'next/router';
import ExerciseReportLayout from '../../../../../courses/components/Latihan/Report/ExerciseReportLayout';

const ExerciseReportPage: NextPage = () => {
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

export default ExerciseReportPage;
