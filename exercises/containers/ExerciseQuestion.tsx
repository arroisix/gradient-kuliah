import React, { useEffect } from 'react';
import LatihanLayout from './LatihanLayout';
import ExerciseWorksheetHeader from 'exercises/components/Header/ExerciseWorksheetHeader';
import ProblemsetTitle from 'exercises/components/ExerciseQuestion/ProblemsetTitle';
import QuestionContent from 'exercises/components/ExerciseQuestion/QuestionContent';
import AnswerContainer from 'exercises/components/ExerciseQuestion/AnswerContainer';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';
import { useRouter } from 'next/dist/client/router';
import { toast } from 'react-toastify';

const ExerciseQuestion: React.FC = () => {
    const router = useRouter();
    const { slug } = router.query;

    const { data: exercise } = useGetExerciseDetailV2Query(
        { exercise_slug: slug as string },
        {
            skip: !slug
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

    return (
        <LatihanLayout>
            <div className="flex flex-col h-full gap-4 lg:gap-6 overflow-y-auto pb-12 lg:pb-0">
                <ExerciseWorksheetHeader />
                <ProblemsetTitle />
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 lg:pb-8 flex-1 h-full lg:min-h-0 overflow-y-auto lg:overflow-hidden">
                    <QuestionContent />
                    <AnswerContainer />
                </div>
            </div>
        </LatihanLayout>
    );
};

export default ExerciseQuestion;
