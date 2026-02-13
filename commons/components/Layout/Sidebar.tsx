import { cn } from 'commons/utils';
import RoleSwitcher from '../modules/Navbar/RoleSwitcher';
import { useAuth } from 'authentication/contexts/AuthProvider';
import DashboardSearchInput from 'dashboard/components/Search/SearchSection/SearchInput';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ProfileMenu } from '../ProfileMenu';
import { MenuItem } from '.';

interface SidebarProps {
    menuItems: MenuItem[];
}

function Sidebar({ menuItems }: SidebarProps): JSX.Element {
    const router = useRouter();
    const { profile } = useAuth();

    return (
        <div
            className={cn(
                'hidden',
                'lg:flex w-64 border-r border-r-[#333333] flex-col justify-between'
            )}>
            <div className="space-y-8">
                <div className="px-6 pt-6 space-y-6">
                    <RoleSwitcher />

                    {profile?.current_role === 'COLLEGE_STUDENT' ? (
                        <DashboardSearchInput placeholder="Cari topik, materi, soal" />
                    ) : (
                        <></>
                    )}
                </div>

                <div className="space-y-4">
                    {menuItems.map((v) => (
                        <Link
                            key={v.href}
                            href={v.href}
                            className="group transition-colors flex items-center gap-3 py-2 px-6">
                            {router.pathname === v.href ? (
                                <v.ActiveIcon
                                    className={cn(
                                        'shrink-0 group-hover:text-white/75 w-6 h-6',
                                        router.pathname === v.href
                                            ? 'text-white'
                                            : 'text-[#4B4E5F]'
                                    )}
                                />
                            ) : (
                                <v.InactiveIcon
                                    className={cn(
                                        'shrink-0 group-hover:text-white/75 w-6 h-6',
                                        router.pathname === v.href
                                            ? 'text-white'
                                            : 'text-[#4B4E5F]'
                                    )}
                                />
                            )}

                            <span
                                className={cn(
                                    'shrink-0 group-hover:text-white/75 leading-tight font-medium',
                                    router.pathname === v.href
                                        ? 'text-white'
                                        : 'text-[#4B4E5F]'
                                )}>
                                {v.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-6 pb-6">
                <ProfileMenu />
            </div>
        </div>
    );
}

export { Sidebar };
