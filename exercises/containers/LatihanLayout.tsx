import React from 'react';
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
    className?: string;
}

const LatihanLayout: React.FC<LatihanLayoutProps> = ({
    children,
    className
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
