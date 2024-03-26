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
    const { data: _, isLoading } = useGetDashboardContentQuery();
    const data: GetDashboardContentResponse = {
        just_released: [
            {
                id: 'beb3c25d-c1fa-455c-b89f-e9848c859356',
                type: 'Textbook',
                thumbnail: '',
                title: 'Dicki, Tromp and Hane',
                in_progress: true,
                course_slug: 'McDermott',
                chapter_id: '34b90a10-8cd6-4ecd-84ee-e521c7534dca',
                subchapter_id: '0350ede9-8544-4429-86a2-39cddeaba238',
                book_slug: 'Gleichner',
                latest_page: 13
            },
            {
                id: '37d854e5-1b9f-4636-8322-7cc5f6b4d6fe',
                type: 'Bank Soal',
                thumbnail: '',
                title: 'Stoltenberg LLC',
                in_progress: false,
                course_slug: 'Rosenbaum',
                chapter_id: '5bce23e5-be5d-4268-9df7-a6d590ec526a',
                subchapter_id: '9063e6f3-ac06-4495-ad0a-835e43a7e8cc',
                book_slug: 'Homenick',
                latest_page: 10
            }
        ],
        book_recommendation: [
            {
                id: '84fe4253-9ff1-43cd-81f4-b1d51bd92650',
                type: 'Video',
                thumbnail: '',
                title: 'Greenholt, Ebert and Hermiston',
                in_progress: false,
                course_slug: 'Braun',
                chapter_id: 'f8f4471f-dd0d-443a-a6cb-6f9e6334a84f',
                subchapter_id: '476fa4ec-0a2f-43fa-a2bc-5483483ab760',
                book_slug: 'Grady',
                latest_page: 3
            },
            {
                id: '4022dc29-fad7-47b0-b52e-b67b9e10080e',
                type: 'Astronotes',
                thumbnail: '',
                title: 'Koelpin - Wunsch',
                in_progress: false,
                course_slug: 'Armstrong',
                chapter_id: 'ff1410e2-03d1-4c55-97b6-441a4a204010',
                subchapter_id: 'b46c55d5-4173-490a-aa6a-0365377aee6b',
                book_slug: 'Wintheiser',
                latest_page: 3
            },
            {
                id: 'efba307a-aa9f-4c9f-8910-1b6aafe38714',
                type: 'Video',
                thumbnail: '',
                title: 'O&#x27;Keefe - Skiles',
                in_progress: false,
                course_slug: 'Schmidt',
                chapter_id: '097e46ad-63ad-4e55-8eaf-dc888cb04743',
                subchapter_id: 'c373d308-fc95-4ff3-b195-048a06eb32cb',
                book_slug: 'Funk',
                latest_page: 42
            }
        ],
        class_recommendation: [
            {
                id: '455f3ce1-7d5c-4463-89fe-efae765bc8f2',
                type: 'Video',
                thumbnail: '',
                title: 'O&#x27;Kon - Parker',
                in_progress: true,
                course_slug: 'Bradtke',
                chapter_id: '32cdbce9-8aac-4016-80b5-0930cb8bdaae',
                subchapter_id: '2cbe1ed3-e9b1-4751-a719-b69ac8b101af',
                book_slug: 'Kautzer',
                latest_page: 16
            },
            {
                id: '4e31e421-281d-48d7-bdde-390dc4618370',
                type: 'Bank Soal',
                thumbnail: '',
                title: 'Harber, O&#x27;Connell and Lynch',
                in_progress: false,
                course_slug: 'Klocko',
                chapter_id: '91c82dc0-4b52-4c4d-83a5-ab5fd464e95f',
                subchapter_id: 'a40a7dd9-da2d-45c8-89e7-38514102140f',
                book_slug: 'Harris',
                latest_page: 37
            }
        ],
        my_class: [
            {
                course_slug: 'Braun',
                course_name: '',
                name: 'Ruthe'
            },
            {
                course_slug: 'dreowniohsetn',
                course_name: '',
                name: 'dreowniohsetn'
            },
            {
                course_slug: 'siaoehtn',
                course_name: '',
                name: 'siaoehtn'
            }
        ]
    };
    const Section = ({
        header,
        items,
        showButton,
        btnHref
    }: {
        header: string;
        items?: LearningMaterial[];
        showButton?: boolean;
        btnHref?: string;
    }): JSX.Element => {
        return (
            <div className="relative space-y-4" data-tour="step-1">
                <div className="flex items-center justify-between md:pr-16">
                    <h4 className="text-lg font-extrabold md:text-xl">
                        {header}
                    </h4>
                    <Button
                        href={btnHref}
                        variant="custom"
                        eventName="Click 'Lihat Semua' in Bank Soal Section"
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
                                    <DashboardCard {...item} />
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <Section header="Baru Rilis" items={data?.just_released} />
            <MyClassesAccordion
                isLoading={isLoading}
                courses={data?.my_class}
            />
            <Section
                header="Bacaan Untukmu"
                items={data?.book_recommendation}
                showButton
                btnHref="/astronotes"
            />
            <Section
                header="Kelas Untukmu"
                items={data?.class_recommendation}
                showButton
                btnHref="/kelas"
            />
        </>
    );
};

export default PrivateDashboardContent;
