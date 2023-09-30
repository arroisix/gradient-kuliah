import { AuthenticationContainer } from 'authentication/containers';
import withAnon from 'commons/withAnon';
import { NextPage } from 'next';

const Login: NextPage = () => <AuthenticationContainer />;

Login.displayName = 'Login';
export default withAnon(Login);
