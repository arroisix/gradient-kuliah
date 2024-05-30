import { BREADCRUMB } from 'commons/constants/breadcrumb';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaChevronRight } from 'react-icons/fa';

const Breadcrumb = ({ className }: { className?: string }): JSX.Element => {
    const router = useRouter();
    const { pathname } = router;
    const breadcrumbPath = pathname as BreadcrumbPathnames;
    const breadcrumbsData = BREADCRUMB[breadcrumbPath];
    const { is_subscribed } = useCourseSubscription();

    if (!breadcrumbsData) return <></>;

    return (
        <div className={cn('flex flex-wrap items-center gap-1', className)}>
            <Item
                name="Home"
                url={is_subscribed ? '/dashboard' : '/'}
                nextItem={breadcrumbsData}
            />
        </div>
    );
};

const Item = ({ name, url, nextItem }: BreadcrumbItemProps): JSX.Element => {
    return (
        <>
            {nextItem? (
                <>
                    <Link href={url} className="cursor-pointer">
                        <h3 className="font-body text-xs lg:text-sm duration-100 transition-all ease-in-out text-[#999999] hover:text-[#999999]/[0.75]">
                            {name}
                        </h3>
                    </Link>
                    <FaChevronRight className="text-[#666666] h-3 md:h-3.5" />
                    <Item
                        name={nextItem.name}
                        url={nextItem.url}
                        nextItem={nextItem.nextItem}
                    />
                </>
            ) : (
                <h3 className="font-body text-xs lg:text-sm text-white">
                    {name}
                </h3>
            )}
        </>
    );
};

export default Breadcrumb;
