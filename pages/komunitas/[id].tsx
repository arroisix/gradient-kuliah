import LearnLayout from 'commons/learnLayout';
import withAuth from 'commons/withAuth';
import DetailSection from 'komunitas/containers/DetailSection';

const DetailKomunitas = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <DetailSection />
        </LearnLayout>
    );
};

export default withAuth(DetailKomunitas);
