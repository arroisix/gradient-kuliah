import Button from 'commons/components/elements/Button';
import Skeleton from 'commons/components/elements/Skeleton';
import { useGetDashboardContentQuery } from 'dashboard/redux/api/dashboardApi';
import React from 'react';
import DashboardCard from './DashboardCard';
import { cn } from 'commons/utils';
import MyClassesAccordion from './MyClassesAccordion';

/** Styling assumptions
 * Sidebar width: 250px
 * Screen XL: 1536px
 */
const CAROUSEL =
    'w-screen relative md:w-[calc(100vw-250px)] gap-4 carousel carousel-center right-4 md:right-8 lg:w-full lg:grid lg:grid-cols-4 xl:gap-6 lg:px-8';
const CAROUSEL_ITEM =
    'carousel-item flex-none first:ml-4 w-[150px] lg:w-full last:mr-4 md:first:ml-8 md:last:mr-8 lg:!m-0';

const PrivateDashboardContent = (): JSX.Element => {
    const { data, isLoading } = useGetDashboardContentQuery();

    return (
        <>
            <Section
                isLoading={isLoading}
                header="Baru Rilis"
                items={data?.just_released}
            />
            <MyClassesAccordion
                isLoading={isLoading}
                courses={data?.my_class}
            />
            <Section
                isLoading={isLoading}
                header="Bacaan Untukmu"
                items={data?.book_recommendation}
                showButton
                btnHref="/astronotes"
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
    return (
        <div className="relative space-y-4" data-tour="step-1">
            <div className="flex items-center justify-between md:pr-16">
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
            <div className={CAROUSEL}>
                {isLoading ? (
                    <Skeleton
                        repeat={4}
                        className={cn(
                            CAROUSEL_ITEM,
                            '!px-0 h-60 !w-[150px] lg:!w-full'
                        )}
                    />
                ) : (
                    <>
                        {items?.map((item) => (
                            <div key={item.id} className={CAROUSEL_ITEM}>
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
