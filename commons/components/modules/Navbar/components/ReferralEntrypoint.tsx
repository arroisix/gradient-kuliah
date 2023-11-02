import { cn } from 'commons/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { FaGift } from 'react-icons/fa';
import { useGetReferralQuery } from 'referral/redux/referalApi';
import { useTracker } from 'tracker/tracker';

const ReferralEntrypoint = (): JSX.Element => {
    const router = useRouter();
    const tracker = useTracker();
    const { data } = useGetReferralQuery();

    function formatCashbackAmount(amount: string): string {
        return `${Number(amount) / 1000}K`.replace('.', ',');
    }

    return (
        <Link
            href="/referral"
            onClick={() =>
                tracker?.genericTrack('Click Referral Cashback Menu')
            }>
            <div
                className="tooltip tooltip-open tooltip-right tooltip-primary [--tooltip-tail:0.45rem] [--tooltip-color:#321465] before:animate-pulse after:animate-pulse mr-28"
                data-tip={`Cashback ${formatCashbackAmount(
                    data?.config.voucher_cashback_amount ?? ''
                )}`}>
                <FaGift
                    size={18}
                    className={cn(
                        'animate-none',
                        router.pathname === '/referral'
                            ? 'text-white'
                            : 'text-[#999999]'
                    )}
                    title="Referral"
                />
            </div>
        </Link>
    );
};

export default ReferralEntrypoint;
