import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';

const NavigationButton = ({
    name,
    title,
    url,
    IconActive,
    IconUnactive,
    className,
    subMenus,
    children,
    setOpenSidebar
}: NavigationButtonProps): JSX.Element => {
    const ACTIVE_STATE = 'text-white font-bold';
    const UNACTIVE_STATE = 'text-[#CCCCCC] font-medium';
    const tracker = useTracker();
    const route = useRouter();

    return (
        <>
            <Link
                href={url}
                className={className}
                onClick={() => {
                    tracker?.genericTrack(`Click${name} Navigation`);
                    if (setOpenSidebar) setOpenSidebar(false);
                }}>
                <span
                    className={cn(
                        'flex gap-4 cursor-pointer hover:text-[#666666] items-center',
                        route.asPath.includes(url) ||
                            route.asPath === url ||
                            (name === 'All Books' &&
                                route.asPath === '/astronotes')
                            ? ACTIVE_STATE
                            : UNACTIVE_STATE
                    )}>
                    {route.asPath.includes(url)
                        ? IconActive && <IconActive size={20} />
                        : IconUnactive && <IconUnactive size={20} />}
                    {title}
                    {children}
                </span>
            </Link>
            {subMenus?.map(({ name, title, url, className, subMenus }) => (
                <NavigationButton
                    key={name}
                    name={name}
                    title={title}
                    url={url}
                    className={`ml-9 ${className}`}
                    subMenus={subMenus}
                    setOpenSidebar={setOpenSidebar}
                />
            ))}
        </>
    );
};

export default NavigationButton;
