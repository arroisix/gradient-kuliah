import moment from 'moment';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BsShieldFillCheck } from 'react-icons/bs';
import Modal from 'src/commons/components/modules/Modal';
import { formatCurrency } from 'src/commons/utils';
import { usePayment } from 'src/payment/contexts/PaymentProvider';
import CheckoutButton from '../CheckoutButton';
import { LOGO_PAYMENT, NAME_PAYMENT } from '../constant';

const ModalCheckout = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
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
                    <div className="rounded-lg h-[50px] w-[100px] bg-white mr-2 flex items-center justify-center">
                        <div className="h-[20px] w-[65px] relative">
                            <Image
                                src={`https://d2uqn6ndx4ow3t.cloudfront.net/assets/payments/${LOGO_PAYMENT[paymentMethod]}`}
                                layout="fill"
                            />
                        </div>
                    </div>
                    <p className="text-base font-bold">
                        {NAME_PAYMENT[paymentMethod]}
                    </p>
                </div>
            </div>
            <div className="w-full flex flex-col mb-4">
                <p className="text-xs text-neutral-400">DETAIL PEMBAYARAN</p>
                <div className="flex items-center w-full mt-2 justify-between">
                    <div className="w-full">
                        <p className="text-base">{course.courseName}</p>
                        <span className="text-xs text-neutral-400">
                            Langganan hingga{' '}
                            {moment()
                                .add(packet.activeDuration, 'M')
                                .format('Do MMMM YYYY')}
                        </span>
                    </div>
                    <div className="min-w-[100px] flex justify-end">
                        <p className="text-base font-bold">
                            {formatCurrency(packet.price)}
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <CheckoutButton
                    packetId={packet.id}
                    paymentMethod={paymentMethod}
                />
                <span className="flex items-center text-xs mt-2">
                    <BsShieldFillCheck className="mr-2" />
                    Secure Payment
                </span>
            </div>
        </Modal>
    );
};

export default ModalCheckout;
