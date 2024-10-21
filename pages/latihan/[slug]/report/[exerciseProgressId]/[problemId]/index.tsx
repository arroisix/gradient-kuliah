import React from 'react';

// use dynamic import for ProblemDetailPage
import dynamic from 'next/dynamic';
// import ProblemDetailPage from 'courses/components/Latihan/Report/Problem/ProblemDetailPage';
import { NextPage } from 'next';

const ProblemDetailPage = dynamic(
    () => import('courses/components/Latihan/Report/Problem/ProblemDetailPage'),
    {
        ssr: false
    }
);

const ProblemDetailPageWrapper: NextPage = () => {
    return <ProblemDetailPage />;
};

export default ProblemDetailPageWrapper;
