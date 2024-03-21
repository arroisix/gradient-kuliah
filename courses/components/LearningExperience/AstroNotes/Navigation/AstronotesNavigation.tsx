import { isNotNullAndUndefined } from 'commons/utils';
import {
    useGetAstronotesContentQuery,
    useGetPublicBookPreviewQuery
} from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React from 'react';
import MobileMenu from './Mobile/MobileMenu';
import Paginator from './Paginator';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

const AstronotesNavigation = (): JSX.Element => {
    const router = useRouter();
    const { slug, page } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed } = useCourseSubscription();
    const privateQueryResult = useGetAstronotesContentQuery(
        { slug: slug as string, page: page as unknown as number },
        {
            skip:
                !isAuthenticated ||
                !is_subscribed ||
                !isNotNullAndUndefined(slug) ||
                !isNotNullAndUndefined(page)
        }
    );
    const publicQueryResult = useGetPublicBookPreviewQuery(
        { slug: slug as string },
        {
            skip:
                (isAuthenticated && is_subscribed) ||
                !isNotNullAndUndefined(slug)
        }
    );
    const { data, isLoading } =
        isAuthenticated && is_subscribed
            ? privateQueryResult
            : publicQueryResult;

    return (
        <div className="relative flex items-center gap-4 md:px-6">
            <MobileMenu />
            {data && (
                <Paginator
                    currentPage={data.current_page}
                    totalPage={data.total_page}
                    isLoading={isLoading}
                    className="flex-1"
                />
            )}
        </div>
    );
};

export default AstronotesNavigation;
