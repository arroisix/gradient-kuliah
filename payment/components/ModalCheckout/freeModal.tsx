import moment from 'moment';
import { useEffect, useState } from 'react';
import { BsShieldFillCheck } from 'react-icons/bs';
import Modal from 'commons/components/modules/Modal';
import { usePayment } from 'payment/contexts/PaymentProvider';
import CheckoutButton from '../CheckoutButton';

const FreeModalCheckout = ({
    isOpen,
    setOpen
}: ModalBaseProps): JSX.Element => {
    const [course, setCourse] = useState({} as Course);
    const { packet, paymentMethod } = usePayment();

    useEffect(() => {
        if (packet && packet?.courses?.length > 0) {
            setCourse(packet?.courses[0]);
        }
    }, [course, packet]);

    return (
        <Modal
            isOpen={isOpen ? 1 : 0}
            setOpen={() => setOpen(0)}
            variant="dark">
            <div className="w-full flex flex-col mb-4">
                <h1 className="text-xl  font-bold">Konfirmasi Pembayaran</h1>
            </div>
            <div className="w-full flex flex-col mb-4">
                <p className="text-xs text-neutral-400">METODE PEMBAYARAN</p>
                <div className="flex items-center w-full mt-2">
                    <p className="text-base font-bold">GRATIS</p>
                </div>
            </div>
            <div className="w-full flex flex-col mb-4">
                <p className="text-xs text-neutral-400">DETAIL PEMBAYARAN</p>
                <div className="flex items-center w-full mt-2 justify-between">
                    <div className="w-full">
                        <p className="text-base">{course.course_name}</p>
                        <span className="text-xs text-neutral-400">
                            Langganan hingga{' '}
                            {moment()
                                .add(packet?.active_duration, 'd')
                                .utc()
                                .format('D MMM YYYY')}
                        </span>
                    </div>
                    <div className="min-w-[100px] flex justify-end">
                        <p className="text-base font-bold">GRATIS</p>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <CheckoutButton
                    packetId={packet?.id as string}
                    paymentMethod={paymentMethod}
                    isFree
                />
                <span className="flex items-center text-xs mt-2">
                    <BsShieldFillCheck className="mr-2" />
                    Secure Payment
                </span>
            </div>
        </Modal>
    );
};

export default FreeModalCheckout;
