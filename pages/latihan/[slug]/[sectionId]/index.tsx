import React from 'react';
import { useRouter } from 'next/router';
import withAuth from 'commons/withAuth';
import ExerciseProblemSetDetail from 'exercises/containers/ExerciseProblemSetDetail';

const SectionPage: React.FC = () => {
    const router = useRouter();
    const { slug, sectionId } = router.query;

    if (!slug || !sectionId) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4 text-white">Loading...</p>
            </div>
        );
    }

    return <ExerciseProblemSetDetail />;
};

export default withAuth(SectionPage);
