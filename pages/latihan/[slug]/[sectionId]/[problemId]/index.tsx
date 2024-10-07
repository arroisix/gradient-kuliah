import React from 'react';
import { useRouter } from 'next/router';
import ProblemPageContent from 'courses/components/Latihan/Problem/ProblemPageContent';

const ProblemPage: React.FC = () => {
    const router = useRouter();
    const { slug, problemId, sectionId } = router.query;

    if (!slug || !problemId || !sectionId) {
        return <div>Loading...</div>;
    }

    return (
        <ProblemPageContent
            slug={slug as string}
            problemId={problemId as string}
            sectionId={sectionId as string}
        />
    );
};

export default ProblemPage;
