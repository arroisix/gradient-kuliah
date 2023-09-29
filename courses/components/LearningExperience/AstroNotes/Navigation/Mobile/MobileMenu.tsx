import React, { useState } from 'react';
import { BiMenu } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';
import ListOfContentsMenu from './ListOfContentsMenu';
import BookmarksMenu from './BookmarksMenu';
import AppearanceMenu from './AppearanceMenu';
import SidebarMenu from '../../Sidebar/SidebarMenu';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';

const MobileMenu = (): JSX.Element => {
    const [isShow, setIsShow] = useState(false);
    const { navigation } = useAstronotes();
    const { isMobileBreakpoints } = useWindowBreakpoints();

    if (!isMobileBreakpoints) return <></>;

    return (
        <div className="relative md:hidden">
            <label className="btn btn-ghost btn-circle btn-sm swap swap-rotate">
                <input
                    type="checkbox"
                    checked={!isShow}
                    onChange={() => setIsShow((prev) => !prev)}
                    className="hidden"
                />
                <BiMenu size={24} className="swap-on" />
                <MdClose size={24} className="swap-off" />
            </label>
            {isShow && (
                <SidebarMenu className="absolute z-10 bottom-8 -left-1" />
            )}

            {navigation === 'LIST_CONTENT' && <ListOfContentsMenu />}
            {navigation === 'BOOKMARK' && <BookmarksMenu />}
            {navigation === 'SETTING' && <AppearanceMenu />}
        </div>
    );
};

export default MobileMenu;
