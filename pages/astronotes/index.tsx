import LearnLayout from 'commons/learnLayout';
import AstronotesEntrypoint from 'courses/containers/learn/astronotes/entrypoint';
import React from 'react';

const AstronotesEntrypointPage = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <AstronotesEntrypoint />
        </LearnLayout>
    );
};

AstronotesEntrypointPage.displayName = 'Library';
export default AstronotesEntrypointPage;
