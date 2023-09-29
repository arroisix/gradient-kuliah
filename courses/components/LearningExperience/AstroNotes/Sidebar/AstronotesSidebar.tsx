import React from 'react';
import SidebarMenu from './SidebarMenu';
import ListOfContentsSidebar from '../ListOfContents/ListOfContentsSidebar';
import BookmarkSidebar from '../Bookmarks/BookmarkSidebar';
import AppearanceSettingSidebar from '../Appearance/AppearanceSettingSidebar';
import { Transition } from '@headlessui/react';
import { transitionClassesSlideRight } from '../constants';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import { cn } from 'commons/utils';

export const AstronotesSidebar = ({
    className
}: PropsWithClassName): JSX.Element => {
    const { navigation } = useAstronotes();
    const renderSidebar = (): JSX.Element | null => {
        switch (navigation) {
            case 'LIST_CONTENT':
                return <ListOfContentsSidebar />;
            case 'BOOKMARK':
                return <BookmarkSidebar />;
            case 'SETTING':
                return <AppearanceSettingSidebar />;
            default:
                return null;
        }
    };

    return (
        <>
            <SidebarMenu className={cn(className)} />
            <Transition
                className={cn(className)}
                show={navigation !== 'CLOSE'}
                {...transitionClassesSlideRight}>
                {renderSidebar()}
            </Transition>
        </>
    );
};

export default AstronotesSidebar;
