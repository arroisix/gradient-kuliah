import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { formatCurrency } from 'commons/utils';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { usePayment } from 'payment/contexts/PaymentProvider';
import { useGetActiveSubscriptionQuery } from 'payment/redux/api/subscriptionApi';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PaketInfo = ({
    packetProp,
    hideLink = false,
    paymentAmount
}: {
    packetProp?: PacketOffer;
    hideLink?: boolean;
    paymentAmount?: number;
}): JSX.Element => {
    const router = useRouter();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: activePacket } = useGetActiveSubscriptionQuery(undefined, {
        skip: !isAuthenticated
    });
    const [topOffset, setTopOffset] = useState(0);

    const { packet: contextPacket } = usePayment();
    const packet = packetProp ?? contextPacket;

    const deactivateAfter = activePacket?.deactivate_after
        ? moment(activePacket.deactivate_after)
        : moment();

    const activeUntil = packet?.active_duration
        ? deactivateAfter.utc(true).add(packet.active_duration, 'days')
        : null;

    useEffect(() => {
        const calculateHeaderHeight = (): void => {
            const navbar = document.querySelector('header');
            const navbarHeight = navbar?.offsetHeight || 56;

            const appBanner = document.querySelector<HTMLElement>(
                '.sticky.top-14.z-\\[20\\]'
            );
            const bannerHeight = appBanner ? appBanner.offsetHeight - 4 : 0;

            setTopOffset(navbarHeight + bannerHeight);
        };

        calculateHeaderHeight();

        const observer = new MutationObserver(() => {
            calculateHeaderHeight();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        window.addEventListener('resize', calculateHeaderHeight);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', calculateHeaderHeight);
        };
    }, []);

    return (
        <section
            style={{ top: topOffset }}
            className="fixed inset-x-0 z-[10] bg-graphite-900 border-gray-700 max-w-[calc(100vw-2rem)] md:max-w-screen-xl mx-auto rounded-xl">
            <div className="mx-4 flex items-center justify-between px-4 py-4">
                <div className="flex flex-col">
                    <h2 className="text-neutral-50 font-semibold text-l">
                        {packet?.packet_name}
                    </h2>
                    {activeUntil && (
                        <p className="mt-1 text-neutral-400 text-sm">
                            Aktif hingga {activeUntil.format('D-MM-YYYY')}
                        </p>
                    )}
                </div>

                {!hideLink ? (
                    <Link
                        href={{
                            pathname: '/pembayaran/ubah-paket',
                            query: router.query
                        }}
                        className="text-[#7264EB] font-semibold text-sm">
                        Ubah Paket
                    </Link>
                ) : paymentAmount != null ? (
                    <span className="text-neutral-50 font-semibold font-body">
                        {formatCurrency(paymentAmount.toString())}
                    </span>
                ) : null}
            </div>
        </section>
    );
};

export default PaketInfo;
