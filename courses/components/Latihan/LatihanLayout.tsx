import React from 'react';
import ExerciseHeader from './ExerciseHeader';

interface LatihanLayoutProps {
    children: React.ReactNode;
    showNavigation?: boolean;
    title?: string;
    prevLink?: string | null;
    nextLink?: string | null;
}

const LatihanLayout: React.FC<LatihanLayoutProps> = ({
    children,
    showNavigation = false,
    title,
    prevLink,
    nextLink
}) => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen pb-9 bg-black px-4">
            <div className="w-[520px]">
                <ExerciseHeader
                    showNavigation={showNavigation}
                    title={title}
                    prevLink={prevLink}
                    nextLink={nextLink}
                />
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
