import React from 'react';
import LatihanLayout from './LatihanLayout';
import ExerciseWorksheetHeader from 'exercises/components/Header/ExerciseWorksheetHeader';
import ProblemsetTitle from 'exercises/components/ExerciseQuestion/ProblemsetTitle';
import QuestionContent from 'exercises/components/ExerciseQuestion/QuestionContent';
import AnswerContainer from 'exercises/components/ExerciseQuestion/AnswerContainer';

const ExerciseQuestion: React.FC = () => {
    return (
        <LatihanLayout>
            <div className="flex flex-col h-full gap-4 lg:gap-6 overflow-y-auto pb-12 lg:pb-0">
                <ExerciseWorksheetHeader />
                <ProblemsetTitle />
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 lg:pb-8 flex-1 h-full lg:min-h-0 overflow-y-auto lg:overflow-hidden">
                    <QuestionContent />
                    <AnswerContainer />
                </div>
            </div>
        </LatihanLayout>
    );
};

export default ExerciseQuestion;
