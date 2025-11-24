import ResultSummary from 'exercises/components/ExerciseDetail/ResultSummary';
import ResultSummaryPerProblem from 'exercises/components/ExerciseDetail/ResultSummaryPerProblem';
import ExerciseCompleteHeader from 'exercises/components/Header/ExerciseCompleteHeader';
import LatihanLayout from './LatihanLayout';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';

const ExerciseReport = () => {
    const router = useRouter();
    const { slug, exerciseProgressId } = router.query;

    const { data: exercise, isLoading } = useGetExerciseDetailV2Query(
        {
            exercise_slug: slug as string,
            exercise_progress_id: exerciseProgressId as string
        },
        {
            skip: !slug
        }
    );

    if (isLoading) {
        return (
            <LatihanLayout>
                <Skeleton className="w-full h-full" />
            </LatihanLayout>
        );
    }

    if (!exercise) {
        return null;
    }

    return (
        <LatihanLayout className="h-full">
            <div className="flex flex-col h-full gap-6">
                <ExerciseCompleteHeader />
                <div className="flex w-full flex-col lg:flex-row gap-5 lg:gap-0 justify-center flex-shrink-0">
                    <ResultSummary isReportMode />
                    <ResultSummaryPerProblem />
                </div>
            </div>
        </LatihanLayout>
    );
};

export default ExerciseReport;
