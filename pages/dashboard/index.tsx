import LearnLayout from 'commons/learnLayout';
import withAnon from 'commons/withAnon';
import DashboardContainer from 'dashboard/containers';
import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';

const Dashboard = (): JSX.Element => {
    return (
        <>
            <NextSeo canonical="https://gradient.academy/dashboard" />
            <LearnLayout showSidebar fullHeightSidebar>
                <DashboardContainer />
            </LearnLayout>
        </>
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
