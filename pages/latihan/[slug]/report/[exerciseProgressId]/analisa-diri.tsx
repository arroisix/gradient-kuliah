import { NextPage } from 'next';
import { useRouter } from 'next/router';
import withAuth from 'commons/withAuth';
import ExerciseLeaderboard from 'exercises/containers/ExerciseLeaderboard';

const ExerciseReflectionPage: NextPage = () => {
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

    return <ExerciseLeaderboard />;
};

export default withAuth(ExerciseReflectionPage);
