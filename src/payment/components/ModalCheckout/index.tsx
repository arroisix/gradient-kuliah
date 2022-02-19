import { BsShieldFillCheck } from 'react-icons/bs';
import Button from 'src/commons/components/elements/Button';
import Modal from 'src/commons/components/modules/Modal';

const ModalCheckout = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
    return (
        <Modal
            isOpen={isOpen ? 1 : 0}
            setOpen={() => setOpen(0)}
            variant="dark">
            <div className="w-full flex flex-col mb-4">
                <h1 className="text-xl  font-bold">Konfirmasi Pembayaran</h1>
            </div>
            <div className="w-full flex flex-col mb-4">
                <p className="font-thin text-xs text-neutral-400">
                    METODE PEMBAYARAN
                </p>
                <div className="flex items-center w-full mt-2">
                    <div className="rounded-lg h-[50px] w-[100px] bg-white mr-2"></div>
                    <p className="text-base font-bold">GOPAY</p>
                </div>
            </div>
            <div className="w-full flex flex-col mb-4">
                <p className="font-thin text-xs text-neutral-400">
                    DETAIL PEMBAYARAN
                </p>
                <div className="flex items-center w-full mt-2 justify-between">
                    <div className="w-full">
                        <p className="text-base font-thin">
                            Introduction to Calculus
                        </p>
                        <span className="text-xs text-neutral-400 font-thin">
                            Langganan hingga 12 Desember 2022
                        </span>
                    </div>
                    <div className="min-w-[100px] flex justify-end">
                        <p className="text-base font-bold">Rp. 50.000</p>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <Button variant="primary" className="w-full">
                    Proses Pembayaran
                </Button>
                <span className="flex items-center text-xs font-thin mt-2">
                    <BsShieldFillCheck className="mr-2" />
                    Secure Payment
                </span>
            </div>
        </Modal>
    );
};

export default ModalCheckout;
