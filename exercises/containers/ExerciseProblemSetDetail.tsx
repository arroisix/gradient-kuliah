import { useRouter } from 'next/router';
import Skeleton from 'commons/components/elements/Skeleton';
import {
    useGetExerciseDetailV2Query,
    useGetProblemsetDetailInterstitialQuery
} from 'exercises/redux/api/exercisesApi';
import LatihanLayout from './LatihanLayout';
import ProblemSetInformation from 'exercises/components/ExerciseDetail/ProblemSetInformation';
import ExerciseProblemSetHeader from 'exercises/components/Header/ExerciseProblemSetHeader';
import ProblemSetRoadmap from 'exercises/components/ExerciseDetail/ProblemSetRoadmap';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ExerciseProblemSetDetail = () => {
    const router = useRouter();
    const { slug, sectionId } = router.query;

    const { data: exercise, isLoading: isLoadingExerciseDetail } =
        useGetExerciseDetailV2Query(
            { exercise_slug: slug as string },
            {
                skip: !slug
            }
        );

    const { isLoading: isLoadingProblemsetDetail } =
        useGetProblemsetDetailInterstitialQuery(
            { slug: slug as string, problemset_id: sectionId as string },
            {
                skip: !slug || !sectionId
            }
        );

    useEffect(() => {
        if (
            exercise &&
            exercise.tryout_type === 'UTBK' &&
            exercise?.latest_exercise_progress?.status !== 'PENDING_SCORING' &&
            exercise?.latest_exercise_progress?.status !== 'COMPLETED' &&
            new Date() > new Date(exercise.closes_at as string)
        ) {
            toast.error('Waktu pengerjaan try out telah berakhir!', {
                position: 'top-center',
                theme: 'colored',
                hideProgressBar: true
            });
            router.replace('/utbk/try-out');
        }
    }, [exercise]);

    if (isLoadingExerciseDetail || isLoadingProblemsetDetail) {
        return (
            <LatihanLayout>
                <div className="flex flex-col lg:flex-row gap-10 h-screen w-full">
                    <div className="flex flex-col gap-4 w-full">
                        <Skeleton className="w-full h-20" />
                        <Skeleton className="w-full h-20" />
                        <Skeleton className="w-full h-20" />
                        <Skeleton className="w-full h-20" />
                        <Skeleton className="w-full h-20" />
                    </div>
                    <Skeleton className="w-full h-1/3" />
                </div>
            </LatihanLayout>
        );
    }

    return (
        <LatihanLayout>
            {/* Mobile View */}
            <div className="lg:hidden flex flex-col h-full bg-black">
                <ExerciseProblemSetHeader />
                <div className="flex-1 overflow-y-auto px-4">
                    <ProblemSetRoadmap />
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:flex flex-col h-full gap-6 overflow-hidden">
                <ExerciseProblemSetHeader />
                <div className="flex w-full gap-10 flex-col lg:flex-row flex-shrink-0 h-full">
                    <ProblemSetRoadmap />
                    <ProblemSetInformation />
                </div>
            </div>
        </LatihanLayout>
    );
};

export default ExerciseProblemSetDetail;
