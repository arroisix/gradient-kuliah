import Image from 'next/image';
import { addZeroBefore } from 'courses/utils';
import { usePayment } from '../contexts/PaymentProvider';
import { posthog } from 'posthog-js';

const MethodBox = ({
    logoUrl,
    paymentMethod,
    isManual
}: {
    logoUrl: string;
    paymentMethod: PaymentMethod;
    isManual?: boolean;
}): JSX.Element => {
    const { setModalCheckoutOpen, setPaymentMethod } = usePayment();

    const onClick = (): void => {
        if (isManual) {
            const currentDate = new Date();
            window.open(
                `https://api.whatsapp.com/send?phone=6285173430127&text=${encodeURIComponent(
                    `Halo, Saya tertarik untuk berlangganan dan membayar via transfer BCA\n\n[ID:${currentDate.getDate()}${addZeroBefore(
                        currentDate.getMonth() + 1
                    )}${currentDate.getFullYear()}:BCA]`
                )}`
            );
            posthog.capture('Attempt to Pay with BCA');
        } else {
            setPaymentMethod(paymentMethod);
            setModalCheckoutOpen(true);
        }
    };
    return (
        <div
            aria-hidden
            className="rounded-lg bg-white p-8 h-[150px] cursor-pointer flex items-center justify-center"
            onClick={onClick}>
            <div className="w-[170px] h-[50px] relative">
                <Image src={logoUrl} layout="fill" className="object-contain" />
            </div>
        </div>
    );
};

export default MethodBox;
