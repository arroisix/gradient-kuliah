import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { useGetActiveSubscriptionQuery } from 'payment/redux/api/subscriptionApi';
import React from 'react';
import { useSelector } from 'react-redux';

const PaketInfo = (): JSX.Element => {
    const router = useRouter();
    const { packet } = usePayment();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: activePacket, isLoading } = useGetActiveSubscriptionQuery(
        undefined,
        { skip: !isAuthenticated }
    );

    const deactivateAfter = activePacket?.deactivate_after
        ? moment(activePacket.deactivate_after)
        : moment();

    console.log(deactivateAfter);

    const activeUntil = packet?.active_duration
        ? deactivateAfter.utc(true).add(packet.active_duration, 'days')
        : null;

    return (
        <section className="fixed inset-x-0 z-10 flex items-center justify-between w-full px-4 py-4 top-16 md:px-12 bg-graphite-900">
            <p className="flex items-center gap-2 font-body">
                <span className="text-sm uppercase">
                    {packet?.packet_name.replace('Paket', '')}
                </span>
                {activeUntil && (
                    <span className="text-sm uppercase">
                        Aktif Hingga {activeUntil.format('D MMMM YYYY')}
                    </span>
                )}
                <span className="w-[1px] h-[18px] bg-neutral-600"></span>
                <span className="text-base font-bold">
                    Rp{Number(packet?.price).toLocaleString('id')}
                </span>
            </p>

            <Link
                href={{
                    pathname: '/pembayaran/ubah-paket',
                    query: router.query
                }}
                className="text-[#7264EB] font-sans font-bold text-sm">
                Ubah Paket
            </Link>
        </section>
    );
};

export default PaketInfo;
