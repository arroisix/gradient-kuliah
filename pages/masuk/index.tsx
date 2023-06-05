import { AuthenticationContainer } from 'authentication/containers';
import { NextPage } from 'next';

const Login: NextPage = () => (
    <div className="flex items-center justify-center w-screen min-h-screen text-white bg-neutral-1000">
        <AuthenticationContainer />
    </div>
);

export default Login;
