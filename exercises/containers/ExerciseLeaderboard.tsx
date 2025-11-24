import React from 'react';
import LatihanLayout from './LatihanLayout';
import ExerciseCompleteHeader from 'exercises/components/Header/ExerciseCompleteHeader';

const ExerciseLeaderboard: React.FC = () => {
    return (
        <LatihanLayout>
            <div className="flex flex-col h-full gap-6">
                <ExerciseCompleteHeader />
                <div className="flex w-full flex-col lg:flex-row gap-5 lg:gap-0 justify-center flex-shrink-0"></div>
            </div>
            <h1>Leaderboard</h1>
        </LatihanLayout>
    );
};

export default ExerciseLeaderboard;
