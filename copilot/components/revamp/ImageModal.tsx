import Image from 'next/image';
import Modal from 'commons/components/modules/Modal';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
}

const ImageModal = ({ isOpen, onClose, imageUrl }: ImageModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            setOpen={onClose}
            variant="dark"
            containerClassName="modal modal-open modal-middle"
            className="bg-transparent max-w-screen-xl">
            <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                    src={imageUrl}
                    alt="embedded image"
                    layout="fill"
                    className="object-cover object-center"
                    priority
                />
            </div>
        </Modal>
    );
};

export default ImageModal;
