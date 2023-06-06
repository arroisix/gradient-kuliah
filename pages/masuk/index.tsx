import { AuthenticationContainer } from 'authentication/containers';
import withAnon from 'commons/withAnon';
import { NextPage } from 'next';

const Login: NextPage = () => <AuthenticationContainer />;

export default withAnon(Login);
