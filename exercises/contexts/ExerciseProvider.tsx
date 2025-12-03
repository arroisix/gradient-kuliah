import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ExerciseContextType {
    showSolution: boolean;
    setShowSolution: React.Dispatch<React.SetStateAction<boolean>>;
    selectedAnswer: string[];
    setSelectedAnswer: React.Dispatch<React.SetStateAction<string[]>>;
    openEndedAnswer: string;
    setOpenEndedAnswer: React.Dispatch<React.SetStateAction<string>>;
    isFinishModalOpen: boolean;
    setIsFinishModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(
    undefined
);

interface ExerciseProviderProps {
    children: ReactNode;
}

export const ExerciseProvider: React.FC<ExerciseProviderProps> = ({
    children
}) => {
    const [showSolution, setShowSolution] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);
    const [openEndedAnswer, setOpenEndedAnswer] = useState<string>('');
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const value: ExerciseContextType = {
        showSolution,
        setShowSolution,
        selectedAnswer,
        setSelectedAnswer,
        openEndedAnswer,
        setOpenEndedAnswer,
        isFinishModalOpen,
        setIsFinishModalOpen,
        isLoading,
        setIsLoading
    };

    return (
        <ExerciseContext.Provider value={value}>
            {children}
        </ExerciseContext.Provider>
    );
};

export const useExercise = (): ExerciseContextType => {
    const context = useContext(ExerciseContext);
    if (context === undefined) {
        throw new Error('useExercise must be used within an ExerciseProvider');
    }
    return context;
};
