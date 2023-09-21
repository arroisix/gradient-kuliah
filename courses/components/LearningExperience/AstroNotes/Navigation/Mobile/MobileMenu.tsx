import React, { Dispatch, SetStateAction, useState } from 'react';
import { BiMenu } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';
import ListOfContentsMenu from './ListOfContentsMenu';
import BookmarksMenu from './BookmarksMenu';
import AppearanceMenu from './AppearanceMenu';
import SidebarMenu from '../../Sidebar/SidebarMenu';

type MobileMenuProps = {
    fontStyle: AstronotesFontStyle;
    setFontStyle: Dispatch<SetStateAction<AstronotesFontStyle>>;
    smallText: boolean;
    setSmallText: Dispatch<SetStateAction<boolean>>;
};

const MobileMenu = ({
    fontStyle,
    setFontStyle,
    smallText,
    setSmallText
}: MobileMenuProps): JSX.Element => {
    const [isShow, setIsShow] = useState(false);
    const [navigation, setNavigation] = useState<NavigationTypes>('CLOSE');

    return (
        <div className="relative">
            {isShow ? (
                <MdClose size={24} onClick={() => setIsShow((prev) => !prev)} />
            ) : (
                <BiMenu size={24} onClick={() => setIsShow((prev) => !prev)} />
            )}
            {isShow && (
                <SidebarMenu
                    navigation={navigation}
                    setNavigation={setNavigation}
                    className="absolute left-[-5px] bottom-[30px] z-[2]"
                />
            )}
            {navigation === 'LIST_CONTENT' && (
                <ListOfContentsMenu setNavigation={setNavigation} />
            )}
            {navigation === 'BOOKMARK' && (
                <BookmarksMenu setNavigation={setNavigation} />
            )}
            {navigation === 'SETTING' && (
                <AppearanceMenu
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                    setNavigation={setNavigation}
                    smallText={smallText}
                    setSmallText={setSmallText}
                />
            )}
            {navigation !== 'CLOSE' ||
                (isShow && (
                    <div
                        className="absolute left-[-20px] bottom-[-25px] w-screen h-screen bg-transparent z-[1]"
                        onClick={() => {
                            setIsShow(false);
                            setNavigation('CLOSE');
                        }}
                        aria-hidden
                    />
                ))}
        </div>
    );
};

export default MobileMenu;
