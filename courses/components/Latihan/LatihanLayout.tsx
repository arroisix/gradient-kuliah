import React, { useState } from 'react';
import ExerciseHeader from './ExerciseHeader';
import QuizNavigationSidebar from './QuizNavigationSidebar';
import ExerciseTimer from './ExerciseTimer';
import { cn } from 'commons/utils';

interface LatihanLayoutProps {
    children: React.ReactNode;
    showNavigation?: boolean;
    title?: string;
    prevLink?: string | null;
    nextLink?: string | null;
    timeConstraint?: string | null | undefined;
    timeLimit?: number;
    currentProblemId?: string;
    problemProgress?: {
        started_at: string;
    };
    firstProblemProgress?: {
        started_at: string;
    };
    onTimeExpired?: () => void;
    isCurrentProblemSubmitted?: boolean;
}

const LatihanLayout: React.FC<LatihanLayoutProps> = ({
    children,
    showNavigation = false,
    title,
    prevLink,
    nextLink,
    timeConstraint,
    timeLimit,
    currentProblemId,
    problemProgress,
    firstProblemProgress,
    onTimeExpired,
    isCurrentProblemSubmitted = false
}) => {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = (): void => setShowSidebar(!showSidebar);

    const canNavigate = timeConstraint !== 'PER_PROBLEM';

    return (
        <div className="flex flex-col px-4 justify-center items-center h-[100dvh] bg-black">
            <QuizNavigationSidebar
                onClose={toggleSidebar}
                isOpen={showSidebar}
            />
            <div className="w-full h-full max-w-[520px] md:px-4">
                <div className="w-full md:w-[520px]">
                    <ExerciseHeader
                        showNavigation={showNavigation && canNavigate}
                        title={title}
                        prevLink={canNavigate ? prevLink : null}
                        nextLink={canNavigate ? nextLink : null}
                        onNavigationClick={toggleSidebar}
                    />
                    {timeConstraint && timeConstraint !== 'NONE' && (
                        <div className="flex justify-center">
                            <ExerciseTimer
                                timeConstraint={timeConstraint}
                                timeLimit={timeLimit}
                                currentProblemId={currentProblemId}
                                problemProgress={problemProgress}
                                firstProblemProgress={firstProblemProgress}
                                onTimeExpired={onTimeExpired}
                                isCurrentProblemSubmitted={
                                    isCurrentProblemSubmitted
                                }
                            />
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        'relative w-full max-w-[520px] h-full md:h-[639px] mb-6 md:mb-9',
                        timeConstraint && timeConstraint !== 'NONE'
                            ? 'max-h-[83dvh]'
                            : 'max-h-[90dvh]'
                    )}>
                    <div className="bg-[#1B2129] rounded-2xl overflow-hidden h-full">
                        <div className="p-6 md:p-8 h-full flex flex-col">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatihanLayout;
