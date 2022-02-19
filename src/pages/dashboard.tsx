import withAuth from 'src/commons/withAuth';
import Layout from 'src/commons/layout';
import DashboardContainer from 'src/dashboard/containers';

const Dashboard = (): JSX.Element => {
    return (
        <Layout>
            <DashboardContainer />
        </Layout>
    );
};

export default withAuth(Dashboard);
