import React from 'react';
import LatihanLayout from './LatihanLayout';
import ExerciseCompleteHeader from 'exercises/components/Header/ExerciseCompleteHeader';
import ExerciseReportNavigation from 'exercises/components/ExerciseReport/ExerciseReportNavigation';
import QuestionContent from 'exercises/components/ExerciseQuestion/QuestionContent';
import AnswerContainer from 'exercises/components/ExerciseQuestion/AnswerContainer';
import ExerciseProblemSolutionAccordion from 'exercises/components/ExerciseReport/ExerciseProblemSolutionAccordion';
import MaterialRecommendation from 'exercises/components/ExerciseReport/MaterialRecommendation';

const ExerciseProblemSolution: React.FC = () => {
    return (
        <LatihanLayout>
            <div className="flex flex-col gap-4 lg:gap-6 overflow-y-auto pb-12 lg:pb-0">
                <div className="fixed top-0 left-0 w-full z-10 flex items-center justify-center px-4 py-4 bg-black">
                    <div className="flex flex-col gap-4 lg:gap-6 max-w-screen-xl w-full">
                        <ExerciseCompleteHeader />
                        <ExerciseReportNavigation />
                    </div>
                </div>
                <div className="flex flex-col mt-32 gap-4 lg:gap-6">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 lg:pb-8 flex-1 h-full lg:min-h-0 overflow-y-auto lg:overflow-hidden">
                        <QuestionContent />
                        <AnswerContainer />
                    </div>
                    <ExerciseProblemSolutionAccordion />
                    <MaterialRecommendation />
                </div>
            </div>
        </LatihanLayout>
    );
};

export default ExerciseProblemSolution;
