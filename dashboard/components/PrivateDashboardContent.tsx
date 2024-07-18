import { useGetDashboardContentQuery } from 'dashboard/redux/api/dashboardApi';
import React from 'react';
import MyClassesAccordion from './MyClassesSection';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import DashboardSection from './DashboardSection';
import { getBookBaseHref } from 'courses/utils';
import ProductCard from 'commons/components/elements/ProductCard';

const PrivateDashboardContent = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data, isLoading, isFetching } = useGetDashboardContentQuery(
        undefined,
        { skip: !isAuthenticated }
    );

    const getHref = (item: LearningMaterial): string => {
        const baseHref = `${getBookBaseHref(item.type)}/${item.book_slug}`;

        if (item.type === 'Video' || item.type === 'Kelas') {
            if (item?.chapter_id && item.subchapter_id)
                return `/kelas/${item.course_slug}/${item.subchapter_slug}`;
            return `/kelas/${item.course_slug}`;
        } else {
            if (item.in_progress && !!item.latest_page) {
                if (item.type === 'Astronotes' && !!item.latest_page) {
                    return `${baseHref}/${item.latest_page}`;
                }

                if (
                    (item.type === 'Bank Soal' || item.type === 'Textbook') &&
                    !!item.latest_problem
                ) {
                    return `${baseHref}/${item.latest_problem}`;
                }
            }
            return baseHref;
        }
    };

    const getProduct = (item: LearningMaterial): Product => ({
        title: item.title,
        thumbnail: item.thumbnail,
        inProgress: false,
        latestProgress: 0
    });

    return (
        <>
            {data?.just_released.length !== 0 && (
                <DashboardSection
                    isLoading={isLoading}
                    header="Baru Rilis"
                    items={data?.just_released}>
                    {(item, i) => (
                        <ProductCard
                            key={data?.just_released[i].id}
                            orientation="vertical"
                            category={(item as LearningMaterial).type}
                            href={getHref(item as LearningMaterial)}
                            product={getProduct(item as LearningMaterial)}
                            eventName='User click Items on "Baru Rilis" Section'
                            className="w-full"
                        />
                    )}
                </DashboardSection>
            )}
            <MyClassesAccordion
                isLoading={isLoading || isFetching}
                courses={data?.my_class}
            />
            <DashboardSection
                isLoading={isLoading}
                header="Bacaan Untukmu"
                items={data?.book_recommendation}
                showButton
                btnHref="/perpustakaan">
                {(item) => (
                    <ProductCard
                        key={(item as LearningMaterial).id}
                        orientation="vertical"
                        category={(item as LearningMaterial)?.type}
                        href={getHref(item as LearningMaterial)}
                        product={getProduct(item as LearningMaterial)}
                        eventName='User click Book Items on "Bacaan Untukmu" Section'
                        className="w-full"
                    />
                )}
            </DashboardSection>
            <DashboardSection
                isCourse
                isLoading={isLoading}
                header="Kelas Untukmu"
                items={data?.class_recommendation}
                showButton
                btnHref="/kelas">
                {(item) => (
                    <ProductCard
                        key={(item as LearningMaterial).id}
                        orientation="vertical"
                        category="kelas"
                        href={`/kelas/${
                            (item as LearningMaterial).course_slug
                        }`}
                        product={getProduct(item as LearningMaterial)}
                        eventName='User click Class Items on "Kelas Untukmu" Section'
                        className="w-full"
                    />
                )}
            </DashboardSection>
        </>
    );
};

export default PrivateDashboardContent;
