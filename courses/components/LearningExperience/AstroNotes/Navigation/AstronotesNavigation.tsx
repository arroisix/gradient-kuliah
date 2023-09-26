import { isNotNullAndUndefined } from 'commons/utils';
import { useGetBookProgressQuery } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React from 'react';
import MobileMenu from './Mobile/MobileMenu';
import Paginator from './Paginator';

const AstronotesNavigation = (): JSX.Element => {
    const router = useRouter();
    const { slug, page } = router.query;
    const { data, isLoading } = useGetBookProgressQuery(
        { slug: slug as string, page: page as unknown as number },
        { skip: !isNotNullAndUndefined(slug) || !isNotNullAndUndefined(page) }
    );

    return (
        <div className="relative flex items-center gap-4 md:px-6">
            <div className="md:hidden">
                <MobileMenu />
            </div>
            {data && (
                <div className="flex-1">
                    <Paginator
                        currentPage={data.current_page}
                        totalPage={data.total_page}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </div>
    );
};

export default AstronotesNavigation;
