import { AuthenticationContainer } from 'authentication/containers';
import withAnon from 'commons/withAnon';
import { NextPage } from 'next';

const Onboarding: NextPage = () => <AuthenticationContainer />;

export default withAnon(Onboarding);
