import React from 'react';

// use dynamic import for ProblemDetailPage
import dynamic from 'next/dynamic';
// import ProblemDetailPage from 'courses/components/Latihan/Report/Problem/ProblemDetailPage';
import { NextPage } from 'next';
import withAuth from 'commons/withAuth';

const ProblemDetailPage = dynamic(
    () => import('exercises/components/Report/Problem/ProblemDetailPage'),
    {
        ssr: false
    }
);

const ProblemDetailPageWrapper: NextPage = () => {
    return <ProblemDetailPage />;
};

export default withAuth(ProblemDetailPageWrapper);
