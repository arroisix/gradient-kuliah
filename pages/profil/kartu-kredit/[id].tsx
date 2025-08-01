import Layout from 'commons/layout';
import withAuth from 'commons/withAuth';
import { ProfileContainer } from 'profile/containers';

const CreditCardDetailsPage = (): JSX.Element => {
    return (
        <Layout>
            <ProfileContainer />
        </Layout>
    );
};

CreditCardDetailsPage.displayName = 'Kartu Kredit';
export default withAuth(CreditCardDetailsPage);
