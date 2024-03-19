import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useGetConfigQuery } from 'commons/redux/api/commonApi';
import { useRouter } from 'next/router';
import React from 'react';
import NavMenuLink from './NavMenuLink';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

const DISPLAYED_ROUTES = [
    'kelas/[id]',
    'kelas/[id]/',
    'kebijakan-privasi',
    'syarat-dan-ketentuan',
    'astronotes',
    'referral',
    'transaksi'
];

const LeftNavbarMenu = ({
    lightMode,
    showSidebar
}: {
    lightMode?: boolean;
    showSidebar?: boolean;
}): JSX.Element | null => {
    const router = useRouter();
    const { data: configData } = useGetConfigQuery();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    const isShowNavbarMenu = (): boolean =>
        !showSidebar &&
        DISPLAYED_ROUTES.slice(isLandingPageRevampOn ? 0 : 1).some((route) =>
            router.pathname.includes(route)
        );

    const NAV_MENUS: NavLink[] = [
        { href: '/dashboard', label: 'Home' },
        {
            href: '/komunitas',
            label: 'Komunitas',
            enabled: configData?.configs
                .is_community_config_enabled as unknown as boolean
        },
        { href: '/kelas', label: 'Kelas' },
        { href: '/astronotes', label: 'Perpustakaan' }
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
