import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetDashboardContentQuery } from 'dashboard/redux/api/dashboardApi';
import React from 'react';
import DashboardCard from './DashboardCard';
import { cn } from 'commons/utils';
import MyClassesAccordion from './MyClassesSection';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

/** Styling assumptions
 * Sidebar width: 250px
 * Screen XL: 1536px
 */
const CAROUSEL =
    'w-screen relative gap-4 carousel carousel-center right-4 xl:gap-6';
const CAROUSEL_ITEM =
    'carousel-item first:ml-4 last:mr-4 lg:first:ml-0 lg:last:mr-0 w-40';

const PrivateDashboardContent = (): JSX.Element => {
    const { data, isLoading, isFetching } = useGetDashboardContentQuery();

    return (
        <>
            {data?.just_released.length !== 0 && (
                <Section
                    isLoading={isLoading}
                    header="Baru Rilis"
                    items={data?.just_released}
                />
            )}
            <MyClassesAccordion
                isLoading={isLoading || isFetching}
                courses={data?.my_class}
            />
            <Section
                isLoading={isLoading}
                header="Bacaan Untukmu"
                items={data?.book_recommendation}
                showButton
                btnHref="/perpustakaan"
                eventName='User click Book Items on "Bacaan Untukmu" Section'
            />
            <Section
                isLoading={isLoading}
                header="Kelas Untukmu"
                items={data?.class_recommendation}
                type="Video"
                showButton
                btnHref="/kelas"
                eventName='User click Class Items on "Kelas Untukmu" Section'
            />
        </>
    );
};

const Section = ({
    isLoading,
    header,
    items,
    showButton,
    btnHref,
    eventName,
    type
}: {
    header: string;
    isLoading: boolean;
    items?: LearningMaterial[];
    showButton?: boolean;
    btnHref?: string;
    eventName?: string;
    type?: LearningMaterial['type'];
}): JSX.Element => {
    const { is_subscribed: isSubscribed } = useCourseSubscription();
    return (
        <div className="relative space-y-4" data-tour="step-1">
            <div className={cn('flex items-center justify-between w-full')}>
                <h4 className="text-lg font-extrabold md:text-xl">{header}</h4>
                <Button
                    href={btnHref}
                    variant="custom"
                    eventName={`User click "Lihat Semua" on "${header}" Section`}
                    className={cn(
                        !showButton && 'hidden',
                        'text-xs text-black bg-white whitespace-nowrap'
                    )}>
                    Lihat Semua
                </Button>
            </div>
            <div
                className={cn(
                    CAROUSEL,
                    isSubscribed &&
                        'md:w-[calc(100vw-250px-4rem)] lg:w-full md:right-8',
                    isSubscribed
                        ? 'lg:grid lg:grid-cols-4 lg:right-auto'
                        : 'md:grid md:grid-cols-4 md:right-auto md:w-full'
                )}>
                {isLoading ? (
                    <Skeleton
                        repeat={4}
                        className={cn(
                            CAROUSEL_ITEM,
                            isSubscribed
                                ? 'md:first:ml-8 md:last:mr-8 lg:w-full'
                                : 'md:first:ml-0 md:last:mr-0 md:w-full',
                            '!px-0 h-60 !w-40 lg:!w-full'
                        )}
                    />
                ) : (
                    <>
                        {items?.map((item) => (
                            <div
                                key={item.id}
                                className={cn(
                                    CAROUSEL_ITEM,
                                    isSubscribed
                                        ? 'md:first:ml-8 md:last:mr-8 lg:w-full'
                                        : 'md:first:ml-0 md:last:mr-0 md:w-full'
                                )}>
                                <DashboardCard
                                    {...item}
                                    eventName={eventName}
                                    eventPayload={
                                        item.type == 'Video'
                                            ? { Course: item.title }
                                            : { Title: item.title }
                                    }
                                    type={type ?? item.type}
                                />
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default PrivateDashboardContent;
