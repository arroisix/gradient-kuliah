import Button from "commons/components/elements/Button";
import Modal from "commons/components/modules/Modal";

interface ConfirmDeleteCardModalProps extends ModalBaseProps {
    onConfirm: () => void;
    confirmButtonDisabled: boolean;
}

const ConfirmDeleteCardModal: React.FC<ConfirmDeleteCardModalProps> = ({
    isOpen,
    setOpen,
    onConfirm,
    confirmButtonDisabled
}) => {
    return (
        <Modal
            isOpen={isOpen}
            setOpen={setOpen}
            variant="dark"
            className="!bg-[#222222]">
            <div className="flex flex-col items-center space-y-4 pb-4">
                <h1 className="font-bold text-lg">Hapus Kartu?</h1>
                <p className="text-sm text-neutral-400 text-center mb-4">
                    Kartu ini akan dihapus dari metode pembayaran, tetapi kamu bisa menambahkannya lagi nanti.
                </p>
                <Button
                    variant="custom"
                    className="bg-[#FF3B30] w-full"
                    disabled={confirmButtonDisabled}
                    onClick={() => onConfirm()}>
                    Hapus Kartu
                </Button>
                <Button
                    variant="custom"
                    className="w-full bg-[#333333]"
                    onClick={() => setOpen(false)}>
                    Batalkan
                </Button>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteCardModal;
