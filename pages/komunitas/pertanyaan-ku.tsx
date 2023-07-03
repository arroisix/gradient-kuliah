import LearnLayout from 'commons/learnLayout';
import withAuth from 'commons/withAuth';
import KomunitasContainer from 'komunitas/containers';
import React from 'react';

const PertanyaanKu = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <KomunitasContainer />
        </LearnLayout>
    );
};

export default withAuth(PertanyaanKu);
