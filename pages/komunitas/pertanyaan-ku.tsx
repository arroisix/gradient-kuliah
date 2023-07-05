import LearnLayout from 'commons/learnLayout';
import withAuth from 'commons/withAuth';
import KomunitasContainer from 'komunitas/containers';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';
import React from 'react';

const PertanyaanKu = (): JSX.Element => {
    return (
        <KomunitasProvider>
            <LearnLayout showSidebar fullHeightSidebar>
                <KomunitasContainer />
            </LearnLayout>
        </KomunitasProvider>
    );
};

export default withAuth(PertanyaanKu);
