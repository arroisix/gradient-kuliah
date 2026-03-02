import { useAuth } from 'authentication/contexts/AuthProvider';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { QuizContent } from './QuizContent';

const AuthWall = dynamic(() => import('../utbk/AuthWall'));
const VideoPricingList = dynamic(() => import('../utbk/VideoPricingList'));

interface MateriQuizContainerProps {
    subchapter: SubChapter;
}

function MateriQuizContainer({
    subchapter
}: MateriQuizContainerProps): JSX.Element {
    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const { profile } = useAuth();
    const { is_subscribed, subscribedFeatures } =
        useCourseSubscription(slug_subtest);

    const { data: exercise, isLoading } = useGetExerciseDetailV2Query(
        { exercise_slug: subchapter.exercise?.slug as string },
        { skip: !subchapter.exercise?.slug || !profile }
    );

    const isShowPayWall =
        (!is_subscribed && !subchapter.exercise?.is_free) ||
        (is_subscribed &&
            !subchapter.exercise?.is_free &&
            !subscribedFeatures?.includes('material'));

    if (isLoading) {
        return (
            <div className="animate-pulse bg-[#333333] mx-4 rounded-2xl h-[calc(100vh-32px-30px-16px-80px)] lg:h-[calc(100vh-32px-36px-16px)]"></div>
        );
    }

    if (!profile) {
        return <AuthWall />;
    }

    if (isShowPayWall) {
        return <VideoPricingList />;
    }

    return (
        <div className="lg:bg-[#101010] lg:p-6 lg:rounded-2xl">
            <QuizContent exercise={exercise} subchapter={subchapter} />
        </div>
    );
}

export default MateriQuizContainer;
