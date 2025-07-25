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
    const { data: activePacket } = useGetActiveSubscriptionQuery(undefined, {
        skip: !isAuthenticated
    });

    const deactivateAfter = activePacket?.deactivate_after
        ? moment(activePacket.deactivate_after)
        : moment();

    console.log(deactivateAfter);

    const activeUntil = packet?.active_duration
        ? deactivateAfter.utc(true).add(packet.active_duration, 'days')
        : null;

    return (
        <section className="fixed inset-x-0 top-16 z-10 bg-graphite-900 border-gray-700">
            <div className="mx-32 flex items-center justify-between px-4 py-4">
                <div className="flex flex-col">
                    <h2 className="text-neutral-50 font-semibold text-xl">
                        {packet?.packet_name}
                    </h2>
                    {activeUntil && (
                        <p className="mt-1 text-neutral-400 text-sm">
                            Aktif hingga {activeUntil.format('D MMMM YYYY')}
                        </p>
                    )}
                </div>

                <Link
                    href={{
                        pathname: '/pembayaran/ubah-paket',
                        query: router.query
                    }}
                    className="text-[#7264EB] font-semibold text-sm">
                    Ubah Paket
                </Link>
            </div>
        </section>
    );
};

export default PaketInfo;
