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
    setOpenSidebar,
    tooltip
}: NavigationButtonProps): JSX.Element => {
    const ACTIVE_STATE = 'text-white font-bold';
    const UNACTIVE_STATE = 'text-[#CCCCCC] font-medium';
    const tracker = useTracker();
    const route = useRouter();

    return (
        <div
            className={cn(
                'flex flex-col gap-4',
                tooltip && 'tooltip tooltip-bottom'
            )}
            data-tip={tooltip}>
            <Link
                href={url}
                className={className}
                onClick={() => {
                    tracker?.genericTrack(`Click${name} Navigation`);
                    if (setOpenSidebar) setOpenSidebar(false);
                }}>
                <span
                    className={cn(
                        'flex gap-4 cursor-pointer hover:text-[#666666] items-center whitespace-nowrap', // Added whitespace-nowrap here
                        route.asPath.includes(url) ||
                            route.asPath === url ||
                            (name === 'All Books' &&
                                route.asPath === '/perpustakaan')
                            ? ACTIVE_STATE
                            : UNACTIVE_STATE
                    )}>
                    {route.asPath.includes(url)
                        ? IconActive && <IconActive size={20} />
                        : IconUnactive && <IconUnactive size={20} />}
                    <span className="whitespace-nowrap">{title}</span>{' '}
                    {/* Also wrapped the title specifically */}
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
        </div>
    );
};

export default NavigationButton;
