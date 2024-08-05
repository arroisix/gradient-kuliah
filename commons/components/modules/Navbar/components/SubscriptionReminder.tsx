import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';

const SubscriptionReminder = ({
    show,
    showSidebar
}: {
    show?: boolean;
    showSidebar?: boolean;
}): JSX.Element => {
    const [showReminder, setShowReminder] = useState(show);

    const {
        expiryDay,
        packet_id: packetId,
        subscription_id: subscriptionId,
        is_subscribed: isSubscribed
    } = useCourseSubscription();

    useEffect(() => {
        setShowReminder(expiryDay <= 7);
    }, [expiryDay]);

    if (!showReminder) return <></>;
    if (!isSubscribed) return <></>;

    return (
        <section
            className={cn(
                showSidebar && 'md:ml-[250px] md:max-w-[calc(100%-250px)]',
                'px-4 py-4 md:px-16 bg-[#121212] sticky top-14 flex justify-between items-center w-full z-[11]'
            )}>
            <p className="flex items-center gap-2 text-sm font-body">
                Langganan habis dalam {expiryDay} hari
            </p>

            <div className="flex items-center gap-6">
                <Link
                    href={{
                        pathname: '/pembayaran',
                        query: { packetId, subscriptionId }
                    }}
                    className="text-[#7264EB] font-sans font-bold text-sm">
                    Perbarui
                </Link>
                <button type="button" onClick={() => setShowReminder(false)}>
                    <MdClose className="text-neutral-600" size={20} />
                </button>
            </div>
        </section>
    );
};

export default SubscriptionReminder;
