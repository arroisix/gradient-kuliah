import React, { useState } from 'react';
import ExerciseHeader from '../components/Header/ExerciseHeader';
import QuizNavigationSidebar from '../components/QuizNavigationSidebar';
import ExerciseTimer from '../components/Header/ExerciseTimer';
import { cn } from 'commons/utils';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';

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
    className?: string;
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
    className,
    isCurrentProblemSubmitted = false
}) => {
    return (
        <div className="flex flex-col py-6 items-center h-[100dvh] bg-black px-4 w-screen relative">
            <div
                className={cn(
                    'max-w-screen-xl lg:max-h-full overflow-y-auto w-full',
                    className
                )}>
                {children}
            </div>
        </div>
    );
};

export default LatihanLayout;
