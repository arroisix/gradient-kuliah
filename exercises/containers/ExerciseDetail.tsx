import { useRouter } from 'next/router';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';
import LatihanLayout from './LatihanLayout';
import ExerciseDetailHeader from 'exercises/components/Header/ExerciseDetailHeader';
import BaseInformation from 'exercises/components/ExerciseDetail/BaseInformation';
import ProblemSetInformation from 'exercises/components/ExerciseDetail/ProblemSetInformation';
import Leaderboard from 'exercises/components/ExerciseDetail/Leaderboard';
import ExerciseCompleteHeader from 'exercises/components/Header/ExerciseCompleteHeader';
import ResultSummary from 'exercises/components/ExerciseDetail/ResultSummary';
import ResultSummaryPerProblem from 'exercises/components/ExerciseDetail/ResultSummaryPerProblem';
import ExercisePaywall from 'exercises/components/ExerciseDetail/ExercisePaywall';
import ScoreNotPublished from 'exercises/components/ExerciseDetail/ScoreNotPublished';
import { BiChevronLeft } from 'react-icons/bi';

const ExerciseDetail = () => {
    const router = useRouter();
    const { slug } = router.query;

    const { data: exercise, isLoading } = useGetExerciseDetailV2Query(
        { exercise_slug: slug as string },
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
                <Skeleton className="w-full h-[92vh]" />
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

    if (exercise?.latest_exercise_progress?.status === 'COMPLETED') {
        return (
            <LatihanLayout className="h-full">
                <div className="flex flex-col h-full gap-6">
                    <ExerciseCompleteHeader />
                    <div className="flex w-full flex-col lg:flex-row gap-5 lg:gap-0 justify-center flex-shrink-0">
                        <ResultSummary />
                        <ResultSummaryPerProblem />
                    </div>
                </div>
            </LatihanLayout>
        );
    }

    return (
        <LatihanLayout className="h-full relative">
            <ExercisePaywall isFree={exercise.is_free} />
            <div className="flex flex-col h-full gap-6">
                <ExerciseDetailHeader />
                <div className="flex w-full gap-10 flex-col lg:flex-row flex-shrink-0">
                    <BaseInformation />
                    <ProblemSetInformation />
                </div>
                <div className="flex flex-col lg:flex-1 lg:min-h-0 justify-end">
                    <Leaderboard />
                </div>
            </div>
        </LatihanLayout>
    );
};

export default ExerciseDetail;
