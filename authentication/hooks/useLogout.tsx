import { useLogoutMutation } from 'authentication/redux/api/authApi';
import { clearCache } from 'authentication/redux/slices/userSlice';
import { removeAllViewedCampaignBannerSlugs } from 'dashboard/redux/slices/bannerSlice';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

const useLogout = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [handleLogout, { isLoading: isLoadingLogout }] = useLogoutMutation();

    const logout = async () => {
        await handleLogout();
        dispatch(clearCache());
        dispatch(removeAllViewedCampaignBannerSlugs());
        setTimeout(() => {
            router.push('/');
        }, 500);
    };

    return { logout, isLoadingLogout };
};

export default useLogout;
