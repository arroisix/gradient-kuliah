import { useLogoutMutation } from 'authentication/redux/api/authApi';
import { clearCache } from 'authentication/redux/slices/userSlice';
import { removeAllViewedCampaignBannerSlugs } from 'dashboard/redux/slices/bannerSlice';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

const useLogout = (delay = 500, redirect = true) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [handleLogout, { isLoading: isLoadingLogout }] = useLogoutMutation();

    const logout = async () => {
        await handleLogout();
        dispatch(clearCache());
        dispatch(removeAllViewedCampaignBannerSlugs());
        if (redirect) {
            setTimeout(() => {
                router.push('/');
            }, delay);
        }
    };

    return { logout, isLoadingLogout };
};

export default useLogout;
