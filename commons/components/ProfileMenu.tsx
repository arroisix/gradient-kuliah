import { useAuth } from 'authentication/contexts/AuthProvider';
import { DropdownMenu } from 'radix-ui';
import UserAvatar from './modules/Navbar/components/UserAvatar';
import { ChevronDownIcon, HistoryIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from 'commons/utils';
import Link from 'next/link';
import { PersonSolidIcon } from './elements/Icons/PersonSolidIcon';
import { FaGift } from 'react-icons/fa6';
import useLogout from 'authentication/hooks/useLogout';
import { LogoutIcon } from './elements/Icons/LogoutIcon';

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

function ProfileMenu(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const { logout, isLoadingLogout } = useLogout();
    const { profile } = useAuth();

    return (
        <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu.Trigger className="bg-[#222222] py-3 px-4 rounded-lg border border-[#333333] flex justify-between items-center gap-3 w-full focus:outline-none">
                <div className="min-w-0 flex items-center gap-3">
                    <UserAvatar profile={profile} />
                    <span className="text-white font-semibold leading-[140%] truncate">
                        {profile?.username}
                    </span>
                </div>

                <ChevronDownIcon
                    className={cn(
                        'shrink-0 text-white w-4 h-4 transition-all',
                        isOpen ? '-rotate-180' : ''
                    )}
                />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    loop
                    side="top"
                    sideOffset={8}
                    className="animate-fade animate-duration-500 bg-[#181818] rounded-lg border border-[#333333] w-[--radix-popper-anchor-width]">
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
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

export { ProfileMenu };
