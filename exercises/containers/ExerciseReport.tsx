import ResultSummary from 'exercises/components/ExerciseDetail/ResultSummary';
import ResultSummaryPerProblem from 'exercises/components/ExerciseDetail/ResultSummaryPerProblem';
import ExerciseCompleteHeader from 'exercises/components/Header/ExerciseCompleteHeader';
import LatihanLayout from './LatihanLayout';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/router';
import { BiChevronLeft } from 'react-icons/bi';
import ScoreNotPublished from 'exercises/components/ExerciseDetail/ScoreNotPublished';

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

    const onClose = () => {
        router.push(`/latihan/`);
    };

    if (isLoading) {
        return (
            <LatihanLayout>
                <div className="flex flex-col lg:flex-row gap-10 h-screen w-full">
                    <Skeleton className="w-full h-1/2" />
                    <Skeleton className="w-full h-1/3" />
                </div>
            </LatihanLayout>
        );
    }

    if (!exercise) {
        return null;
    }

    if (
        exercise?.latest_exercise_progress?.status === 'COMPLETED' &&
        exercise.tryout_type === 'UTBK' &&
        new Date() < new Date(exercise?.score_published_at as string)
    ) {
        return (
            <LatihanLayout className="h-full">
                <header className="w-full flex items-center justify-center gap-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-0 bottom-auto left-0 cursor-pointer rounded-full p-2 bg-[#333540]">
                        <BiChevronLeft size={24} />
                    </button>
                </header>
                <ScoreNotPublished />
            </LatihanLayout>
        );
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
