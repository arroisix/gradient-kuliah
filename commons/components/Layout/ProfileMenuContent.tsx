import Link from 'next/link';
import { DropdownMenu } from 'radix-ui';
import { PersonSolidIcon } from '../elements/Icons/PersonSolidIcon';
import { HistoryIcon } from 'lucide-react';
import { FaGift } from 'react-icons/fa6';
import { LogoutIcon } from '../elements/Icons/LogoutIcon';
import useLogout from 'authentication/hooks/useLogout';
import { cn } from 'commons/utils';

const profileMenuItems = [
    {
        title: 'Profil',
        href: '/profil',
        Icon: PersonSolidIcon
    },
    {
        title: 'Riwayat Pembelian',
        href: '/transaksi',
        Icon: HistoryIcon
    },
    {
        title: 'Referral',
        href: '/referral',
        Icon: FaGift
    }
];

function ProfileMenuContent(): JSX.Element {
    const { logout, isLoadingLogout } = useLogout();

    return (
        <div
            className={cn(
                'animate-fade animate-duration-500 bg-[#181818] rounded-lg border border-[#333333] w-64',
                'lg:w-[--radix-popper-anchor-width]'
            )}>
            {profileMenuItems.map((v) => (
                <DropdownMenu.Item key={v.href} asChild>
                    <Link
                        href={v.href}
                        className="group flex items-center gap-3 transition-all p-4 focus:outline-none outline-none">
                        <v.Icon className="shrink-0 text-white group-hover:text-white/75 w-4 h-4" />{' '}
                        <span className="shrink-0 text-white group-hover:text-white/75 font-semibold text-sm leading-tight">
                            {v.title}
                        </span>
                    </Link>
                </DropdownMenu.Item>
            ))}

            <DropdownMenu.Item asChild>
                <button
                    onClick={() => logout()}
                    disabled={isLoadingLogout}
                    type="button"
                    className="group flex items-center gap-3 transition-all p-4 focus:outline-none outline-none w-full">
                    <LogoutIcon className="shrink-0 text-[#FF3B30] group-hover:text-[#FF3B30]/75 w-4 h-4" />{' '}
                    <span className="shrink-0 text-[#FF3B30] group-hover:text-[#FF3B30]/75 font-semibold text-sm leading-tight">
                        Logout
                    </span>
                </button>
            </DropdownMenu.Item>
        </div>
    );
}

export { ProfileMenuContent };
