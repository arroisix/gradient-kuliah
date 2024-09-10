import { useRouter } from 'next/router';
import ExerciseReportLayout from '../../../courses/components/Latihan/Report/ExerciseReportLayout';

const ExerciseReportPage = () => {
    const router = useRouter();
    const { slug } = router.query;

    return <ExerciseReportLayout />;
};

export default ExerciseReportPage;
