import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import DashboardContainer from 'dashboard/containers';
import { GetStaticProps } from 'next';

const Dashboard = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <DashboardContainer />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = () => {
    return {
        props: {
            canonical: 'https://gradient.academy/dashboard'
        }
    };
};

Dashboard.displayName = 'Dashboard';
export default withAnon(Dashboard);
