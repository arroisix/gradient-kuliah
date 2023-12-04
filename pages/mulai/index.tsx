import { OnboardingSuccess } from 'authentication/containers/OnboardingSection/OnboardingSuccess';
import { useLogoutMutation } from 'authentication/redux/api/authApi';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import withAuth from 'commons/withAuth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const Mulai = (): JSX.Element => {
    const router = useRouter();
    const user = useSelector(getCurrentUser);
    const [logout] = useLogoutMutation();

    return (
        <section className="text-white h-screen overflow-hidden">
            <div className="fixed top-0 left-0 hidden gap-2 px-6 py-3 md:flex font-body z-[2]">
                <span className="text-[#666666]">
                    Terdaftar sebagai {user.email}
                </span>{' '}
                <button
                    onClick={async () => {
                        await logout();
                        router.push('/')
                    }}
                    className="text-[#999999] hover:text-red-400 transition-all duration-500">
                    Sign Out
                </button>
            </div>
            <OnboardingSuccess />
        </section>
    );
};

export default withAuth(Mulai);
