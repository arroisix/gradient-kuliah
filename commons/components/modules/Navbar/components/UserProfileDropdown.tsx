import React from 'react';
import { useTracker } from 'tracker/tracker';
import Link from 'next/link';
import { MdLogout, MdPerson } from 'react-icons/md';
import { cn } from 'commons/utils';
import { useLogoutMutation } from 'authentication/redux/api/authApi';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { clearCache } from 'authentication/redux/slices/userSlice';
import { useThemeContext } from 'commons/contexts/ThemeProvider';

const UserProfileDropdown = (): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch();

    const { theme } = useThemeContext();
    const lightMode = theme === 'light';

    return (
        <>
            <li>
                <Link
                    href="/profil"
                    className={cn(lightMode ? 'text-black' : 'text-white')}
                    onClick={() => {
                        tracker?.genericTrack('Click Profile');
                    }}>
                    <MdPerson size={16} className="mr-2" />
                    <span>Profil</span>
                </Link>
            </li>
            <li>
                <button
                    className="text-accent-orange hover:bg-[#1D1D1D]"
                    onClick={async () => {
                        tracker?.genericTrack('Click Logout');
                        await logout();
                        dispatch(clearCache());
                        router.push('/');
                    }}>
                    <MdLogout size={16} className="mr-2" />
                    <span>Logout</span>
                </button>
            </li>
        </>
    );
};

export default UserProfileDropdown;
