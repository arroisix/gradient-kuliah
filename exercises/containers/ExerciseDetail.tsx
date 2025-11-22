import { useRouter } from 'next/router';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';
import LatihanLayout from './LatihanLayout';
import ExerciseDetailHeader from 'exercises/components/Header/ExerciseDetailHeader';
import BaseInformation from 'exercises/components/ExerciseDetail/BaseInformation';
import ProblemSetInformation from 'exercises/components/ExerciseDetail/ProblemSetInformation';
import Leaderboard from 'exercises/components/ExerciseDetail/Leaderboard';

const ExerciseDetail = () => {
    const router = useRouter();
    const { slug } = router.query;

    const { data: exercise, isLoading } = useGetExerciseDetailV2Query(
        { exercise_slug: slug as string },
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

    console.log('exercise', exercise);

    return (
        <LatihanLayout className="h-full">
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
