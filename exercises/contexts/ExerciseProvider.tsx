import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ExerciseContextType {
    // Add your state and methods here
    showSolution: boolean;
    setShowSolution: React.Dispatch<React.SetStateAction<boolean>>;
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

    const value: ExerciseContextType = {
        showSolution,
        setShowSolution
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
