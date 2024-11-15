import Image from 'next/image';
import { addZeroBefore } from 'courses/utils';
import { usePayment } from '../contexts/PaymentProvider';
import { useTracker } from 'tracker/tracker';
import { CDN_URL } from 'commons/constants';
import { LOGO_PAYMENT, NAME_PAYMENT } from './constant';
import { PropsWithChildren } from 'react';
import { getCSChatRoom } from 'commons/utils';

type MethodBoxProps = {
    paymentMethod: PaymentMethod;
    isManual?: boolean;
    onClick?: () => void;
} & PropsWithChildren;

const MethodBox = ({
    paymentMethod,
    isManual,
    onClick,
    children
}: MethodBoxProps): JSX.Element => {
    const { setModalCheckoutOpen, setPaymentMethod } = usePayment();
    const tracker = useTracker();

    const selectOption = (): void => {
        if (isManual) {
            tracker?.genericTrack('Click Manual Payment Method', {
                'Method Name': paymentMethod
            });
            const currentDate = new Date();
            window.open(
                getCSChatRoom(
                    'IG',
                    encodeURIComponent(
                        `Halo, Saya tertarik untuk berlangganan dan membayar via transfer BCA\n\n[ID:${currentDate.getDate()}${addZeroBefore(
                            currentDate.getMonth() + 1
                        )}${currentDate.getFullYear()}:BCA]`
                    )
                )
            );
        } else {
            tracker?.genericTrack('Click Payment Method', {
                'Method Name': paymentMethod
            });
            setPaymentMethod(paymentMethod);
            setModalCheckoutOpen(true);
        }
    };

    return (
        <button
            data-tip={NAME_PAYMENT[paymentMethod]}
            className="tooltip tooltip-bottom rounded-lg bg-white p-6 h-[69px] md:h-[81px] cursor-pointer flex items-center justify-center"
            onClick={onClick ?? selectOption}>
            {children || (
                <div className="w-[94px] h-[28px] md:w-[110px] md:h-[33px] relative">
                    <Image
                        src={`${CDN_URL}/assets/payments/${LOGO_PAYMENT[paymentMethod]}`}
                        layout="fill"
                        className="object-contain"
                    />
                </div>
            )}
        </button>
    );
};

export default MethodBox;
