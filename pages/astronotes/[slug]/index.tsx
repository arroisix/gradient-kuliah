import LearnLayout from 'commons/learnLayout';
import AstronotesDetail from 'courses/containers/learn/astronotes/detail';

const AstronotesDetailPage = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <AstronotesDetail />
        </LearnLayout>
    );
};

AstronotesDetailPage.displayName = 'Book Detail';
export default AstronotesDetailPage;
