import { skipToken } from '@reduxjs/toolkit/dist/query';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import Modal from 'commons/components/modules/Modal';
import { CDN_URL } from 'commons/constants';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetReferralQuery } from 'referral/redux/referalApi';
import { useTracker } from 'tracker/tracker';

const ReferralModal = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
    const tracker = useTracker();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data } = useGetReferralQuery(
        !isAuthenticated ? skipToken : undefined
    );

    function formatCashbackAmount(amount: string): string {
        return `${Number(amount) / 1000}K`.replace('.', ',');
    }

    useEffect(() => {
        if (isOpen) tracker?.genericTrack('View Referral Reminder Modal');
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            setOpen={setOpen}
            permanent={true}
            variant="dark"
            className="text-center md:!max-w-md">
            <Image
                src={`${CDN_URL}/assets/referral_cashback_asset.png`}
                width={isMobileBreakpoints ? 120 : 160}
                height={isMobileBreakpoints ? 120 : 160}
                alt="Referral"
            />
            <h5 className="mt-10 mb-3 text-2xl font-bold">
                Undang teman, dapatkan cashback{' '}
                {formatCashbackAmount(
                    data?.config.voucher_cashback_amount ?? ''
                )}
            </h5>
            <p className="text-neutral-400">
                Untuk setiap teman diundang yang berhasil membeli paket Gradient
            </p>
            <div className="flex flex-col gap-3 mt-8">
                <Button
                    eventName="Click Go To Referral Page"
                    href="/referral"
                    variant="primary">
                    Bagikan Referral
                </Button>
                <Button
                    onClick={() => setOpen(false)}
                    eventName="Click Ignore Referral Modal"
                    variant="custom"
                    className="text-white bg-neutral-700">
                    Nanti Saja
                </Button>
            </div>
        </Modal>
    );
};

export default ReferralModal;
