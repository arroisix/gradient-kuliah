import { OnboardingSuccess } from 'authentication/containers/OnboardingSection/OnboardingSuccess';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { removeUser } from 'authentication/redux/slices/userSlice';
import withAuth from 'commons/withAuth';
import { useDispatch, useSelector } from 'react-redux';
import { useTracker } from 'tracker/tracker';

const Mulai = (): JSX.Element => {
    const dispatch = useDispatch();
    const user = useSelector(getCurrentUser);
    const tracker = useTracker();
    const logout = () => {
        dispatch(removeUser());
        tracker?.reset();
    };

    return (
        <section className="text-white h-screen overflow-hidden">
            <div className="fixed top-0 left-0 hidden gap-2 px-6 py-3 md:flex font-body z-[2]">
                <span className="text-[#666666]">
                    Terdaftar sebagai {user.email}
                </span>{' '}
                <button
                    onClick={logout}
                    className="text-[#999999] hover:text-red-400 transition-all duration-500">
                    Sign Out
                </button>
            </div>
            <OnboardingSuccess />
        </section>
    );
};

export default withAuth(Mulai);
