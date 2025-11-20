import React from 'react';
import { useRouter } from 'next/router';
import ProblemPageContent from 'exercises/components/Problem/ProblemPageContent';
import withAuth from 'commons/withAuth';
import ExerciseQuestion from 'exercises/containers/ExerciseQuestion';

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

    return <ExerciseQuestion />;
};

export default withAuth(ProblemPage);
