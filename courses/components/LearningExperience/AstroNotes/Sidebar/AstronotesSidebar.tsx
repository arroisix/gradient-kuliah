import React, { Dispatch, SetStateAction, useState } from 'react';
import SidebarMenu from './SidebarMenu';
import ListOfContentsSidebar from '../ListOfContents/ListOfContentsSidebar';
import BookmarkSidebar from '../Bookmarks/BookmarkSidebar';
import AppearanceSettingSidebar from '../Appearance/AppearanceSettingSidebar';
import { Transition } from '@headlessui/react';
import { transitionClassesSlideRight } from '../constants';
interface AstronotesSidebarProps extends Partial<HTMLDivElement> {
    fontStyle: AstronotesFontStyle;
    setFontStyle: Dispatch<SetStateAction<AstronotesFontStyle>>;
    smallText: boolean;
    setSmallText: Dispatch<SetStateAction<boolean>>;
}

export const AstronotesSidebar = ({
    fontStyle,
    setFontStyle,
    smallText,
    setSmallText
}: AstronotesSidebarProps): JSX.Element => {
    const [navigation, setNavigation] = useState<NavigationTypes>('CLOSE');

    const renderSidebar = (): JSX.Element | null => {
        switch (navigation) {
            case 'LIST_CONTENT':
                return <ListOfContentsSidebar setNavigation={setNavigation} />;
            case 'BOOKMARK':
                return <BookmarkSidebar setNavigation={setNavigation} />;
            case 'SETTING':
                return (
                    <AppearanceSettingSidebar
                        fontStyle={fontStyle}
                        setFontStyle={setFontStyle}
                        setNavigation={setNavigation}
                        smallText={smallText}
                        setSmallText={setSmallText}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <SidebarMenu
                navigation={navigation}
                setNavigation={setNavigation}
                className="hidden md:flex"
            />
            <Transition
                className="hidden md:flex"
                show={navigation !== 'CLOSE'}
                {...transitionClassesSlideRight}>
                {renderSidebar()}
            </Transition>
        </>
    );
};

export default AstronotesSidebar;
