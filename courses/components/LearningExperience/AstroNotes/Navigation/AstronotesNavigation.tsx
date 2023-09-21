import { isNotNullAndUndefined } from 'commons/utils';
import { useGetBookProgressQuery } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction } from 'react';
import MobileMenu from './Mobile/MobileMenu';
import Paginator from './Paginator';

type AstronotesNavigationProps = {
    fontStyle: AstronotesFontStyle;
    setFontStyle: Dispatch<SetStateAction<AstronotesFontStyle>>;
    smallText: boolean;
    setSmallText: Dispatch<SetStateAction<boolean>>;
};

const AstronotesNavigation = ({
    fontStyle,
    setFontStyle,
    smallText,
    setSmallText
}: AstronotesNavigationProps): JSX.Element => {
    const router = useRouter();
    const { slug, page } = router.query;
    const { data, isLoading } = useGetBookProgressQuery(
        { slug: slug as string, page: page as unknown as number },
        { skip: !isNotNullAndUndefined(slug) || !isNotNullAndUndefined(page) }
    );

    return (
        <div className="relative flex">
            <div className="md:hidden pl-5">
                <MobileMenu
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                    smallText={smallText}
                    setSmallText={setSmallText}
                />
            </div>
            {data && (
                <div className="w-full px-5">
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
