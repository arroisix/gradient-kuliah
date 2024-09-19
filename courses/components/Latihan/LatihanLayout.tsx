import React, { useState } from 'react';
import ExerciseHeader from './ExerciseHeader';
import QuizNavigationSidebar from './QuizNavigationSidebar';
import ExerciseTimer from './ExerciseTimer';

interface LatihanLayoutProps {
    children: React.ReactNode;
    showNavigation?: boolean;
    title?: string;
    prevLink?: string | null;
    nextLink?: string | null;
    timeConstraint?: string | null | undefined;
    timeLimit?: number;
    currentProblemId?: string;
}

const LatihanLayout: React.FC<LatihanLayoutProps> = ({
    children,
    showNavigation = false,
    title,
    prevLink,
    nextLink,
    timeConstraint,
    timeLimit,
    currentProblemId
}) => {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen pb-9 bg-black px-4">
            {showSidebar && <QuizNavigationSidebar onClose={toggleSidebar} />}
            <div className="w-[520px]">
                <ExerciseHeader
                    showNavigation={showNavigation}
                    title={title}
                    prevLink={prevLink}
                    nextLink={nextLink}
                    onNavigationClick={toggleSidebar}
                />
                {timeConstraint && timeConstraint !== 'NONE' && (
                    <div className="mt-2 flex justify-center">
                        <ExerciseTimer
                            timeConstraint={timeConstraint}
                            timeLimit={timeLimit}
                            currentProblemId={currentProblemId}
                        />
                    </div>
                )}
            </div>
            <div className="relative w-full max-w-[520px] h-[639px]">
                <div className="bg-[#1B2129] rounded-2xl overflow-hidden h-full">
                    <div className="p-8 h-full flex flex-col">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default LatihanLayout;
