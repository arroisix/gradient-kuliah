import { useFeatureIsOn } from '@growthbook/growthbook-react';
import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import KomunitasContainer from 'komunitas/containers';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';

const Komunitas = (): JSX.Element => {
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );
    return isLandingPageRevampOn ? (
        <KomunitasProvider>
            <LearnLayout showSidebar fullHeightSidebar>
                <KomunitasContainer />
            </LearnLayout>
        </KomunitasProvider>
    ) : (
        <></>
    );
};

Komunitas.displayName = 'Community Explore';
export default withAnon(Komunitas);
