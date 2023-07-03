import LearnLayout from 'commons/learnLayout';
import withAuth from 'commons/withAuth';
import KomunitasContainer from 'komunitas/containers';

const Komunitas = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <KomunitasContainer />
        </LearnLayout>
    );
};

export default withAuth(Komunitas);
