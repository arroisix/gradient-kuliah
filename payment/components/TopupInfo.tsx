import CreditPicker from 'commons/components/CreditPicker';
import Button from 'commons/components/elements/Button';
import Modal from 'commons/components/modules/Modal';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { formatCurrency } from 'commons/utils';
import { useRouter } from 'next/router';
import { usePayment } from 'payment/contexts/PaymentProvider';
import React, { useEffect, useState } from 'react';

const TopupInfo = ({
    hideLink = false,
    paymentAmount
}: {
    hideLink?: boolean;
    paymentAmount?: number;
}): JSX.Element => {
    const { topupAmount, setTopupAmount } = usePayment();
    const [topOffset, setTopOffset] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const router = useRouter();

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

    const onBuy = () => {
        router.push('/topup?amount=' + topupAmount);
        setIsOpen(false);
    };

    return (
        <>
            <section
                style={{ top: topOffset }}
                className="fixed inset-x-0 z-[10] bg-graphite-900 border-gray-700 max-w-[calc(100vw-2rem)] md:max-w-screen-xl mx-auto rounded-xl">
                <div className="mx-4 flex items-center justify-between px-4 py-4">
                    <div className="flex flex-col">
                        <h2 className="text-neutral-50 font-semibold text-l">
                            {
                                formatCurrency(topupAmount as unknown as string)
                                    .slice(2)
                                    .split(',')[0]
                            }{' '}
                            Credit
                        </h2>
                        <p className="mt-1 text-neutral-400 text-sm">
                            Copilot AI
                        </p>
                    </div>

                    {!hideLink ? (
                        <Button
                            onClick={() => setIsOpen(true)}
                            variant="tertiary"
                            className="font-semibold text-sm">
                            Ubah Nilai Topup
                        </Button>
                    ) : paymentAmount != null ? (
                        <span className="text-neutral-50 font-semibold font-body">
                            {formatCurrency(paymentAmount.toString())}
                        </span>
                    ) : null}
                </div>
            </section>
            <Modal
                isOpen={isOpen}
                setOpen={setIsOpen}
                variant="dark"
                className={
                    isMobileBreakpoints
                        ? '!max-w-full !w-full !m-0 !rounded-t-2xl !rounded-b-none fixed bottom-0 left-0 right-0 !max-h-[70vh] flex flex-col p-0 !overflow-hidden bg-[#222222] z-[10000]'
                        : '!max-w-[520px] p-4'
                }>
                <CreditPicker
                    credit={topupAmount as unknown as string}
                    isLoading={false}
                    selectedAmount={topupAmount}
                    setSelectedAmount={setTopupAmount}
                    onBuy={onBuy}
                />
            </Modal>
        </>
    );
};

export default TopupInfo;
