import React from 'react';
import { useTracker } from 'tracker/tracker';
import Link from 'next/link';
import { MdLogout, MdOutlinePersonOutline } from 'react-icons/md';
import { cn } from 'commons/utils';
import { useLogoutMutation } from 'authentication/redux/api/authApi';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { clearCache } from 'authentication/redux/slices/userSlice';

const UserProfileDropdown = ({
    lightMode,
    isProfileHovered
}: {
    lightMode?: boolean;
    isProfileHovered: boolean;
}): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch();

    return (
        <div
            className={cn(
                'p-4 min-w-[250px] top-10 right-0 absolute shadow-md rounded-md border border-[#2D2D2D]',
                lightMode ? 'bg-white text-black' : 'bg-black text-white',
                isProfileHovered ? 'block' : 'hidden'
            )}>
            <Link
                href={'/profil'}
                onClick={() => {
                    tracker?.genericTrack('Click Profile');
                }}>
                <div
                    className={cn(
                        'flex hover:bg-[#1D1D1D] px-2 py-3 rounded-sm font-normal w-full items-center',
                        lightMode ? 'text-black' : 'text-white'
                    )}>
                    <MdOutlinePersonOutline className="text-2xl" />
                    <p className="w-full ml-4 text-base">Profil</p>
                </div>
            </Link>
            <div
                className="flex items-center w-full font-normal text-accent-orange hover:bg-[#1D1D1D] px-2 py-3 rounded-sm"
                onClick={async () => {
                    tracker?.genericTrack('Click Logout');
                    await logout();
                    dispatch(clearCache());
                    router.push('/');
                }}
                aria-hidden>
                <div>
                    <MdLogout className="text-2xl" />
                </div>
                <div className="w-full ml-4">
                    <p className="text-base">Logout</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfileDropdown;
