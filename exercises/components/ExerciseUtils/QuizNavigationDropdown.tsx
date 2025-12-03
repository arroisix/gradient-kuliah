import React, { useEffect, useRef } from 'react';
import QuizNavigationModal from './QuizNavigationModal';
import { cn } from 'commons/utils';

interface QuizNavigationDropdownProps {
    onProblemSelect: (problemId: string) => void;
    isOpen: boolean;
    onClose: () => void;
    anchorEl?: HTMLElement | null;
    saveAnswer?: (options: {
        navigateDirection: 'custom';
        customProblemId: string;
    }) => Promise<void>;
}

const QuizNavigationDropdown: React.FC<QuizNavigationDropdownProps> = ({
    onProblemSelect,
    isOpen,
    onClose,
    anchorEl,
    saveAnswer
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                anchorEl &&
                !anchorEl.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, anchorEl]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />

            {/* Dropdown */}
            <div
                ref={dropdownRef}
                className={cn(
                    'absolute top-full mt-2 right-0 z-50',
                    'animate-in fade-in slide-in-from-top-2 duration-200'
                )}>
                <QuizNavigationModal
                    onProblemSelect={onProblemSelect}
                    onClose={onClose}
                    saveAnswer={saveAnswer}
                />
            </div>
        </>
    );
};

export default QuizNavigationDropdown;
