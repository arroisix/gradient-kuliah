import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import DetailSection from 'komunitas/containers/DetailSection';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';

const DetailKomunitas = (): JSX.Element => {
    return (
        <KomunitasProvider>
            <LearnLayout showSidebar fullHeightSidebar>
                <DetailSection />
            </LearnLayout>
        </KomunitasProvider>
    );
};

DetailKomunitas.displayName = 'Community Detail';
export default withAnon(DetailKomunitas);
