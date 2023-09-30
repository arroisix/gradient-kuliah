import { AuthenticationContainer } from 'authentication/containers';
import withAuth from 'commons/withAuth';
import { NextPage } from 'next';

const Onboarding: NextPage = () => <AuthenticationContainer />;

Onboarding.displayName = 'Onboarding';
export default withAuth(Onboarding);
