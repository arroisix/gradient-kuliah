import React from 'react';
import { NextPage } from 'next';
import withAuth from 'commons/withAuth';
import ExerciseProblemSolution from 'exercises/containers/ExerciseProblemSolution';
import { ExerciseProvider } from 'exercises/contexts/ExerciseProvider';

const ProblemDetailPageWrapper: NextPage = () => {
    return (
        <ExerciseProvider>
            <ExerciseProblemSolution />
        </ExerciseProvider>
    );
};

export default withAuth(ProblemDetailPageWrapper);
