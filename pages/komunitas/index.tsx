import LearnLayout from 'commons/learnLayout';
import withAuth from 'commons/withAuth';
import KomunitasContainer from 'komunitas/containers';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';

const Komunitas = (): JSX.Element => {
    return (
        <KomunitasProvider>
            <LearnLayout showSidebar fullHeightSidebar>
                <KomunitasContainer />
            </LearnLayout>
        </KomunitasProvider>
    );
};

Komunitas.displayName = 'Community Explore';
export default withAuth(Komunitas);
