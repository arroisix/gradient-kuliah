import { AuthenticationContainer } from 'authentication/containers';
import withAnon from 'commons/withAnon';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

const Login: NextPage = () => (
    <>
        <NextSeo canonical="https://gradient.academy/masuk" />
        <AuthenticationContainer />
    </>
);

Login.displayName = 'Login';
export default withAnon(Login);
