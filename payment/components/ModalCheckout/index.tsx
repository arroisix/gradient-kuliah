import moment from 'moment';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BsShieldFillCheck } from 'react-icons/bs';
import Modal from 'commons/components/modules/Modal';
import { formatCurrency } from 'commons/utils';
import { usePayment } from 'payment/contexts/PaymentProvider';
import CheckoutButton from '../CheckoutButton';
import { LOGO_PAYMENT, NAME_PAYMENT } from '../constant';

const ModalCheckout = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
    const [course, setCourse] = useState({} as Course);
    const { packet, packets, paymentMethod, setPacket } = usePayment();

    useEffect(() => {
        if (packet && packet?.courses?.length > 0) {
            setCourse(packet?.courses[0]);
        }
    }, [course, packet]);

    const onClose = (): void => {
        setPacket();
        setOpen(0);
    };

    if (!packet) {
        return (
            <Modal isOpen={isOpen ? 1 : 0} setOpen={onClose} variant="dark">
                <div className="w-full flex flex-col mb-4">
                    <h1 className="text-xl  font-bold">Pilih Paket</h1>
                </div>
                <div className="flex flex-col gap-2">
                    {packets.map((p: Packet) => (
                        <div
                            className="flex w-full gap-2 hover:bg-neutral-700 p-2 rounded-md underline"
                            key={p.id}
                            aria-hidden
                            onClick={() => setPacket(p)}>
                            {p.packet_name}
                        </div>
                    ))}
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen ? 1 : 0} setOpen={onClose} variant="dark">
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
                <div className="flex items-start w-full mt-2 justify-between">
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
                        <p className="text-base font-bold">
                            {formatCurrency(packet?.price as string)}
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <CheckoutButton
                    packetId={packet?.id as string}
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
