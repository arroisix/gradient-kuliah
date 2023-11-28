import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import DashboardContainer from 'dashboard/containers';

const Dashboard = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <DashboardContainer />
        </LearnLayout>
    );
};

Dashboard.displayName = 'Dashboard';
export default withAnon(Dashboard);
