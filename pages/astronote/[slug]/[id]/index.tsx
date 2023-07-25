import LearnLayout from 'commons/learnLayout';
import AstronoteHome from 'courses/containers/learn/astronotes/home';
import { LearningProvider } from 'courses/contexts/LearningProvider';
import React from 'react';

const AstroNotes = (): JSX.Element => {
    return (
        <LearningProvider>
            <LearnLayout lightMode>
                <AstronoteHome />
            </LearnLayout>
        </LearningProvider>
    );
};

export default AstroNotes;
