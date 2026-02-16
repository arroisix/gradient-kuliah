import { cn } from 'commons/utils';
import { MenuItem } from '.';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface MobileNavbarProps {
    menuItems: MenuItem[];
}

function MobileNavbar({ menuItems }: MobileNavbarProps): JSX.Element {
    const router = useRouter();

    return (
        <div
            className={cn(
                'bg-black fixed z-50 bottom-0 left-0 right-0 py-2.5 flex justify-evenly items-center',
                'lg:hidden'
            )}>
            {(menuItems.length > 5
                ? menuItems.slice(0, menuItems.length - 1)
                : menuItems
            ).map((v) => (
                <Link
                    key={v.href}
                    href={v.href}
                    className="basis-1/5 group flex-grow flex flex-col items-center gap-1 transition-all">
                    {router.pathname.includes(v.href) ? (
                        <v.ActiveIcon
                            className={cn(
                                'shrink-0 group-hover:text-white/75 w-5 h-5',
                                router.pathname.includes(v.href)
                                    ? 'text-white'
                                    : 'text-[#4B4E5F]'
                            )}
                        />
                    ) : (
                        <v.InactiveIcon
                            className={cn(
                                'shrink-0 group-hover:text-white/75 w-5 h-5',
                                router.pathname.includes(v.href)
                                    ? 'text-white'
                                    : 'text-[#4B4E5F]'
                            )}
                        />
                    )}

                    <span
                        className={cn(
                            'shrink-0 group-hover:text-white/75 text-xs leading-tight font-medium',
                            router.pathname.includes(v.href)
                                ? 'text-white'
                                : 'text-[#4B4E5F]'
                        )}>
                        {v.title}
                    </span>
                </Link>
            ))}
        </div>
    );
}

export { MobileNavbar };
