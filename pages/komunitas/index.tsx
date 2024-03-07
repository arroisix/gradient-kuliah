import LearnLayout from 'commons/learnLayout';
import withAuth from 'commons/withAuth';
import KomunitasContainer from 'komunitas/containers';
import { KomunitasProvider } from 'komunitas/contexts/KomunitasProvider';
import { GetStaticProps } from 'next';

const Komunitas = (): JSX.Element => {
    return (
        <KomunitasProvider>
            <LearnLayout showSidebar fullHeightSidebar>
                <KomunitasContainer />
            </LearnLayout>
        </KomunitasProvider>
    );
};

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            canonical: 'https://gradient.academy/komunitas'
        }
    };
};

Komunitas.displayName = 'Community Explore';
export default withAuth(Komunitas);
