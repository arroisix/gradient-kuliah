import React from 'react';
import { NextPage } from 'next';
import withAuth from 'commons/withAuth';
import ExerciseProblemSolution from 'exercises/containers/ExerciseProblemSolution';

const ProblemDetailPageWrapper: NextPage = () => {
    return <ExerciseProblemSolution />;
};

export default withAuth(ProblemDetailPageWrapper);
