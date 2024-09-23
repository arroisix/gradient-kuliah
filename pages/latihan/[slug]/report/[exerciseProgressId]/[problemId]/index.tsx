import React from 'react';
import dynamic from 'next/dynamic';

const ProblemDetailPage = dynamic(
    () =>
        import(
            '../../../../../../courses/components/Latihan/Report/Problem/ProblemDetailPage'
        ),
    { ssr: false }
);

const ProblemDetailPageWrapper: React.FC = () => {
    return <ProblemDetailPage />;
};

export default ProblemDetailPageWrapper;
