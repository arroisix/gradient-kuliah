import { useAuth } from 'authentication/contexts/AuthProvider';
import { useLogoutMutation } from 'authentication/redux/api/authApi';
import { clearCache } from 'authentication/redux/slices/userSlice';
import { removeAllViewedCampaignBannerSlugs } from 'dashboard/redux/slices/bannerSlice';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

const useLogout = (delay = 500, redirect = true) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [handleLogout, { isLoading: isLoadingLogout }] = useLogoutMutation();
    const { profile } = useAuth();

    const logout = async () => {
        await handleLogout();
        dispatch(clearCache());
        dispatch(removeAllViewedCampaignBannerSlugs());
        if (redirect) {
            setTimeout(() => {
                if (profile?.current_role === 'K12') {
                    router.push('/utbk');
                } else {
                    router.push('/');
                }
            }, delay);
        }
    };

    return { logout, isLoadingLogout };
};

export default useLogout;
