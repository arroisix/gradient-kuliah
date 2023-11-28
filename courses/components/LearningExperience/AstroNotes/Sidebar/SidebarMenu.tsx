import React from 'react';
import { ASTRONOTES_MENU, PUBLIC_ASTRONOTES_MENU } from '../constants';
import { useAstronotes } from 'courses/contexts/AstronotesProvider';
import { cn } from 'commons/utils';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

const SidebarMenu = ({ className }: PropsWithClassName): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed } = useCourseSubscription();

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
            {(isAuthenticated ? ASTRONOTES_MENU : PUBLIC_ASTRONOTES_MENU).map(
                (menu) => (
                    <li key={menu.value}>
                        <a
                            className={cn(
                                'tooltip tooltip-right p-1.5 rounded-btn',
                                navigation === menu.value && 'active',
                                !is_subscribed &&
                                    !PUBLIC_ASTRONOTES_MENU.includes(menu) &&
                                    '[&_svg]:opacity-20'
                            )}
                            data-tip={menu.label}
                            onClick={() => {
                                if (
                                    !is_subscribed &&
                                    !PUBLIC_ASTRONOTES_MENU.includes(menu)
                                )
                                    return;
                                if (menu.eventNames) {
                                    switch (menu.value) {
                                        case 'LIST_CONTENT':
                                            if (navigation === menu.value) {
                                                tracker?.genericTrack(
                                                    menu.eventNames.close,
                                                    {
                                                        'Book Slug':
                                                            router.query.slug,
                                                        'Book Page Query':
                                                            router.query.page
                                                    }
                                                );
                                            } else {
                                                tracker?.genericTrack(
                                                    menu.eventNames.open,
                                                    {
                                                        'Book Slug':
                                                            router.query.slug,
                                                        'Book Page Query':
                                                            router.query.page
                                                    }
                                                );
                                            }
                                            break;
                                        case 'BOOKMARK':
                                        case 'SETTING':
                                        case 'RATING':
                                        case 'FEEDBACK':
                                            tracker?.genericTrack(
                                                menu.eventNames.click,
                                                {
                                                    'Book Slug':
                                                        router.query.slug,
                                                    'Book Page Query':
                                                        router.query.page
                                                }
                                            );
                                            break;
                                    }
                                }
                                selectMenu(menu.value);
                            }}
                            aria-hidden>
                            {menu.icon}
                        </a>
                    </li>
                )
            )}
        </ul>
    );
};

export default SidebarMenu;
