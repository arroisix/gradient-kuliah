import React from 'react';
import LatihanLayout from './LatihanLayout';
import ExerciseCompleteHeader from 'exercises/components/Header/ExerciseCompleteHeader';
import ExerciseReportNavigation from 'exercises/components/ExerciseReport/ExerciseReportNavigation';
import QuestionContent from 'exercises/components/ExerciseQuestion/QuestionContent';
import AnswerContainer from 'exercises/components/ExerciseQuestion/AnswerContainer';
import ExerciseProblemSolutionAccordion from 'exercises/components/ExerciseReport/ExerciseProblemSolutionAccordion';

const ExerciseProblemSolution: React.FC = () => {
    return (
        <LatihanLayout>
            <div className="flex flex-col h-full gap-4 lg:gap-6 overflow-y-auto pb-12 lg:pb-0">
                <ExerciseCompleteHeader />
                <ExerciseReportNavigation />
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 lg:pb-8 flex-1 h-full lg:min-h-0 overflow-y-auto lg:overflow-hidden">
                    <QuestionContent />
                    <AnswerContainer />
                </div>
                <ExerciseProblemSolutionAccordion />
            </div>
        </LatihanLayout>
    );
};

export default ExerciseProblemSolution;
