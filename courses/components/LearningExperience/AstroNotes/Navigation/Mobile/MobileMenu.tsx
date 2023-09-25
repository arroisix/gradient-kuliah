import React, { useState } from 'react';
import { BiMenu } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';
import ListOfContentsMenu from './ListOfContentsMenu';
import BookmarksMenu from './BookmarksMenu';
import AppearanceMenu from './AppearanceMenu';
import SidebarMenu from '../../Sidebar/SidebarMenu';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';

const MobileMenu = (): JSX.Element => {
    const [isShow, setIsShow] = useState(false);
    const { navigation, setNavigation } = useAstronotes();

    return (
        <div className="relative">
            {isShow ? (
                <MdClose size={24} onClick={() => setIsShow((prev) => !prev)} />
            ) : (
                <BiMenu size={24} onClick={() => setIsShow((prev) => !prev)} />
            )}
            {isShow && (
                <SidebarMenu className="absolute left-[-5px] bottom-[30px] z-[2]" />
            )}
            {navigation === 'LIST_CONTENT' && <ListOfContentsMenu />}
            {navigation === 'BOOKMARK' && <BookmarksMenu />}
            {navigation === 'SETTING' && <AppearanceMenu />}
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
