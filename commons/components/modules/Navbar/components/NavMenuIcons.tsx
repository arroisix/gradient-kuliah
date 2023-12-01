import Link from 'next/link';
import React from 'react';
import BookmarkAstronotes from './BookmarkAstronotes';
import { MdHistory } from 'react-icons/md';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';
import ReferralEntrypoint from './ReferralEntrypoint';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { cn } from 'commons/utils';

const HIDE_HISTORY_ICON_ON = ['kelas/[id]/', 'astronotes/'];

const NavMenuIcons = (): JSX.Element => {
    const router = useRouter();
    const tracker = useTracker();
    const { is_subscribed, isLoading } = useCourseSubscription();

    const isShowHistoryIcon = (): boolean =>
        !HIDE_HISTORY_ICON_ON.some((route) => router.pathname.includes(route));

    return (
        <div className="flex items-center gap-6 text-xs font-bold">
            <BookmarkAstronotes />
            {!isLoading && is_subscribed && <ReferralEntrypoint />}
            {isShowHistoryIcon() && (
                <Link
                    href="/transaksi"
                    onClick={() =>
                        tracker?.genericTrack('Click Payment History Menu')
                    }>
                    <MdHistory
                        size={24}
                        className={cn(
                            router.pathname === '/transaksi'
                                ? 'text-[#999999]'
                                : 'text-white'
                        )}
                        title="Riwayat Pembelian"
                    />
                </Link>
            )}
        </div>
    );
};

export default NavMenuIcons;
