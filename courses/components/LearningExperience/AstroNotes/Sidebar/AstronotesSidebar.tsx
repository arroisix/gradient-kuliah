import React, { Dispatch, SetStateAction, useState } from 'react';
import SidebarMenu from './SidebarMenu';
import ListOfContentsSidebar from '../ListOfContents/ListOfContentsSidebar';
import BookmarkSidebar from '../Bookmarks/BookmarkSidebar';
import AppearanceSettingSidebar from '../Appearance/AppearanceSettingSidebar';

type AstronotesSidebarProps = {
    fontStyle: AstronotesFontStyle;
    setFontStyle: Dispatch<SetStateAction<AstronotesFontStyle>>;
    smallText: boolean;
    setSmallText: Dispatch<SetStateAction<boolean>>;
};

export const AstronotesSidebar = ({
    fontStyle,
    setFontStyle,
    smallText,
    setSmallText
}: AstronotesSidebarProps): JSX.Element => {
    const [navigation, setNavigation] = useState<NavigationTypes>('CLOSE');
    return (
        <div className="flex gap-[10px]">
            <SidebarMenu
                navigation={navigation}
                setNavigation={setNavigation}
                className="h-[calc(100vh-88px)]"
            />
            {navigation === 'LIST_CONTENT' && (
                <ListOfContentsSidebar setNavigation={setNavigation} />
            )}
            {navigation === 'BOOKMARK' && (
                <BookmarkSidebar setNavigation={setNavigation} />
            )}
            {navigation === 'SETTING' && (
                <AppearanceSettingSidebar
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                    setNavigation={setNavigation}
                    smallText={smallText}
                    setSmallText={setSmallText}
                />
            )}
        </div>
    );
};

export default AstronotesSidebar;
