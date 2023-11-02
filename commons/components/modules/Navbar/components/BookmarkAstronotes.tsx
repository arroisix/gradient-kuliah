import { isNotNullAndUndefined } from 'commons/utils';
import {
    useGetBookProgressQuery,
    usePostBookmarksMutation
} from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useTracker } from 'tracker/tracker';

const BookmarkAstronotes = (): JSX.Element | null => {
    const router = useRouter();
    const { slug, page } = router?.query;
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { data: bookProgressData, isLoading: isBookProgressLoading } =
        useGetBookProgressQuery(
            { slug: slug as string, page: page as unknown as number },
            {
                skip:
                    !isNotNullAndUndefined(slug) || !isNotNullAndUndefined(page)
            }
        );

    useEffect(() => {
        setIsBookmarked(bookProgressData?.is_bookmarked as boolean);
    }, [bookProgressData]);

    const tracker = useTracker();
    const [postBookmark] = usePostBookmarksMutation();

    const handleBookmark = (): void => {
        const payload = {
            'Book Slug': slug,
            'Book Page Query': page
        };
        if (isBookmarked) tracker?.genericTrack('Remove Bookmark', payload);
        else tracker?.genericTrack('Add Bookmark', payload);

        postBookmark({
            slug: slug as string,
            page_order: bookProgressData?.current_page as number,
            is_active: !isBookmarked
        });
        setIsBookmarked((prev) => !prev);
    };

    return router.pathname.includes('astronotes/') && !isBookProgressLoading ? (
        <button onClick={handleBookmark}>
            {isBookmarked ? (
                <BsBookmarkFill size={18} className="text-[#999999]" />
            ) : (
                <BsBookmark size={18} className="text-[#999999]" />
            )}
        </button>
    ) : null;
};

export default BookmarkAstronotes;
