import { useRouter } from 'next/router';
import withAuth from 'commons/withAuth';
import ExerciseQuestion from 'exercises/containers/ExerciseQuestion';
import { ExerciseProvider } from 'exercises/contexts/ExerciseProvider';

const ProblemPage: React.FC = () => {
    const router = useRouter();
    const { slug, problemId, sectionId } = router.query;

    if (!slug || !problemId || !sectionId) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4 text-white">Loading...</p>
            </div>
        );
    }

    return (
        <ExerciseProvider>
            <ExerciseQuestion />
        </ExerciseProvider>
    );
};

export default withAuth(ProblemPage);
