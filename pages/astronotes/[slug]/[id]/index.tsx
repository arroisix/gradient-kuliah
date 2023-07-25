import LearnLayout from 'commons/learnLayout';
import AstronoteHome from 'courses/containers/learn/astronotes/home';
import React from 'react';

const AstroNotes = (): JSX.Element => {
    return (
        <LearnLayout lightMode>
            <AstronoteHome />
        </LearnLayout>
    );
};

export default AstroNotes;
