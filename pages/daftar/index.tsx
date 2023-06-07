import { AuthenticationContainer } from 'authentication/containers';
import withAnon from 'commons/withAnon';
import { NextPage } from 'next';

const Registration: NextPage = () => <AuthenticationContainer />;

export default withAnon(Registration);
