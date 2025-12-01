import React from 'react';
import { useTracker } from 'tracker/tracker';
import Link from 'next/link';
import { MdFileDownload, MdHistory, MdLogout, MdPerson } from 'react-icons/md';
import { cn } from 'commons/utils';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import { FaGift } from 'react-icons/fa';
import useLogout from 'authentication/hooks/useLogout';

const UserProfileDropdown = (): JSX.Element => {
    const tracker = useTracker();
    const { logout } = useLogout();

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
                <Link
                    href="/transaksi"
                    className={cn(lightMode ? 'text-black' : 'text-white')}
                    onClick={() => {
                        tracker?.genericTrack('Click Transaction History');
                    }}>
                    <MdHistory size={16} className="mr-2" />
                    <span>Riwayat Pembelian</span>
                </Link>
            </li>
            <li>
                <Link
                    href="/kelas/downloads"
                    className={cn(lightMode ? 'text-black' : 'text-white')}
                    onClick={() => {
                        tracker?.genericTrack('Click Downloads');
                    }}>
                    <MdFileDownload size={16} className="mr-2" />
                    <span>Downloads</span>
                </Link>
            </li>
            <li>
                <Link
                    href="/referral"
                    className={cn(lightMode ? 'text-black' : 'text-white')}
                    onClick={() => {
                        tracker?.genericTrack('Click Referral');
                    }}>
                    <FaGift size={16} className="mr-2" />
                    <span>Referral</span>
                </Link>
            </li>
            <li>
                <button
                    className="text-accent-orange hover:bg-[#1D1D1D]"
                    onClick={async () => {
                        tracker?.genericTrack('Click Logout');
                        await logout();
                    }}>
                    <MdLogout size={16} className="mr-2" />
                    <span>Logout</span>
                </button>
            </li>
        </>
    );
};

export default UserProfileDropdown;
