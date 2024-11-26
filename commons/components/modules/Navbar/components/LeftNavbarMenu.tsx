import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useGetConfigQuery } from 'commons/redux/api/commonApi';
import { useRouter } from 'next/router';
import React from 'react';
import NavMenuLink from './NavMenuLink';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { LEARNING_PAGES } from 'commons/constants';

const LeftNavbarMenu = ({
    lightMode,
    showSidebar
}: {
    lightMode?: boolean;
    showSidebar?: boolean;
}): JSX.Element | null => {
    const router = useRouter();
    const { data: configData } = useGetConfigQuery();
    const { is_subscribed } = useCourseSubscription();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    const isShowNavbarMenu = (): boolean =>
        !showSidebar &&
        is_subscribed &&
        LEARNING_PAGES.slice(isLandingPageRevampOn ? 0 : 1).some((route) =>
            router.pathname.includes(route)
        );

    const NAV_MENUS: NavLink[] = [
        { href: '/dashboard', label: 'Home' },
        {
            href: '/copilot',
            label: 'Copilot AI',
            enabled: configData?.configs
                .is_copilot_config_enabled as unknown as boolean,
            tooltip: 'Copilot AI gratis selama versi Beta!'
        },
        {
            href: '/komunitas',
            label: 'Diskusi'
        },
        { href: '/kelas', label: 'Kelas' },
        { href: '/perpustakaan', label: 'Perpustakaan' },
        {
            href: '/latihan',
            label: 'Latihan',
            enabled: configData?.configs
                .is_exercise_config_enabled as unknown as boolean
        }
    ];

    return !isMobileBreakpoints && isShowNavbarMenu() ? (
        <div className="flex gap-6 pl-4">
            {NAV_MENUS.map((menu) => (
                <NavMenuLink key={menu.label} lightMode={lightMode} {...menu} />
            ))}
        </div>
    ) : null;
};

export default LeftNavbarMenu;
