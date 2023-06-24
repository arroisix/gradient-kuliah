import LearnLayout from 'commons/learnLayout';
import withAuth from 'commons/withAuth';
import DashboardContainer from 'dashboard/containers';

const Dashboard = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <DashboardContainer />
        </LearnLayout>
    );
};

export default withAuth(Dashboard);
