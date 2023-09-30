import Layout from 'commons/layout';
import withAuth from 'commons/withAuth';
import { ProfileContainer } from 'profile/containers';

const EducationLevel = (): JSX.Element => {
    return (
        <Layout>
            <ProfileContainer />
        </Layout>
    );
};

EducationLevel.displayName = 'Education Profile';
export default withAuth(EducationLevel);
