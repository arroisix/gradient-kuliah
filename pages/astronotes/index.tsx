import LearnLayout from 'commons/learnLayout';
import AstronotesEntrypoint from 'courses/containers/learn/astronotes/entrypoint';
import { GetStaticProps } from 'next';
import React from 'react';

const AstronotesEntrypointPage = (): JSX.Element => {
    return (
        <>
            <LearnLayout showSidebar fullHeightSidebar>
                <AstronotesEntrypoint />
            </LearnLayout>
        </>
    );
};

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            canonical: 'https://gradient.academy/astronotes'
        }
    };
};

AstronotesEntrypointPage.displayName = 'Library';
export default AstronotesEntrypointPage;
