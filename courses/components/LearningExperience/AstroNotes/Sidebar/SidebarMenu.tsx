import React from 'react';
import { ASTRONOTES_MENU } from '../constants';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import { cn } from 'commons/utils';

const SidebarMenu = ({ className }: PropsWithClassName): JSX.Element => {
    const {
        navigation,
        setNavigation,
        setIsModalFeedbackOpen,
        setIsModalRatingOpen
    } = useAstronotes();

    const selectMenu = (value: NavigationTypes): void => {
        if (value === 'RATING') setIsModalRatingOpen(true);
        else if (value === 'FEEDBACK') setIsModalFeedbackOpen(true);
        else setNavigation((prev) => (prev === value ? 'CLOSE' : value));
    };

    return (
        <ul
            className={cn(
                'menu px-1 py-4 gap-2 menu-sm bg-[#F6F5F8] dark:bg-[#121212] rounded-box text-black dark:text-[#999999]',
                className
            )}>
            {ASTRONOTES_MENU.map((menu) => (
                <li key={menu.value}>
                    <a
                        className={cn(
                            'tooltip tooltip-right p-1.5 rounded-btn',
                            navigation === menu.value && 'active'
                        )}
                        data-tip={menu.label}
                        onClick={() => selectMenu(menu.value)}
                        aria-hidden>
                        {menu.icon}
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default SidebarMenu;
