import LearnLayout from 'commons/learnLayout';
import DashboardContainer from 'dashboard/containers';

const Dashboard = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <DashboardContainer />
        </LearnLayout>
    );
};

export default Dashboard;
