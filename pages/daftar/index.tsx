import { AuthenticationContainer } from 'authentication/containers';
import withAnon from 'commons/withAnon';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

const Registration: NextPage = () => (
    <>
        <NextSeo canonical="https://gradient.academy/daftar" />
        <AuthenticationContainer />
    </>
);

Registration.displayName = 'Register';
export default withAnon(Registration);
