import { Layout } from 'commons/components/Layout';
import { cn } from 'commons/utils';
import withAnon from 'commons/withAnon';
import DashboardContainer from 'dashboard/containers';
import type { GetStaticProps } from 'next';

const Dashboard = (): JSX.Element => {
    return (
        <Layout>
            <div className={cn('m-4', 'lg:mx-12 lg:my-8')}>
                <DashboardContainer />
            </div>
        </Layout>
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
