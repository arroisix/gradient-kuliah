import Image from 'next/image';
import Button from 'src/commons/components/elements/Button';
import Modal from 'src/commons/components/modules/Modal';

const DialogSuccess = ({ isOpen, setOpen }: ModalBaseProps): JSX.Element => {
    return (
        <Modal isOpen={isOpen ? 1 : 0} setOpen={() => setOpen(0)} dialog>
            <div className="w-full flex flex-col items-center">
                <div className="w-[170px] h-[153px] mb-2">
                    <Image
                        src="https://d2uqn6ndx4ow3t.cloudfront.net/assets/auth_success.png"
                        width={170}
                        height={153}
                    />
                </div>
                <h1 className="text-2xl text-center font-bold mb-2">
                    Berhasil buat akun
                </h1>
                <p className="text-center text-neutral-400">
                    Yuk lihat kelas - kelas yang ada!
                </p>
                <Button
                    variant="custom"
                    className="bg-accent-purple text-white mt-4 w-full"
                    onClick={() => setOpen(0)}>
                    Oke, Siap
                </Button>
            </div>
        </Modal>
    );
};

export default DialogSuccess;
