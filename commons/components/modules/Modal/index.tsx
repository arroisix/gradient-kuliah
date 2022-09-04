import { MdClose } from 'react-icons/md';
import { ReactNode } from 'react';

interface ModalProps extends ModalBaseProps {
    children: ReactNode;
    permanent?: boolean;
    dialog?: boolean;
    variant?: 'light' | 'dark';
}

const Modal = ({
    isOpen,
    setOpen,
    children,
    permanent = false,
    dialog = false,
    variant = 'light'
}: ModalProps): JSX.Element => {
    if (isOpen > 0) {
        return (
            <div
                aria-hidden={true}
                className="fixed h-screen w-screen bg-black bg-opacity-75 flex items-center justify-center top-0 left-0 z-50 shadow-sm"
                onClick={permanent ? undefined : () => setOpen(0)}>
                <div
                    aria-hidden={true}
                    className={`relative p-4 rounded-md z-100 w-[365px] min-h-[100px] ${
                        dialog || variant == 'dark'
                            ? 'bg-neutral-800 text-white'
                            : 'bg-white text-black '
                    }`}
                    onClick={(e) => e.stopPropagation()}>
                    {!permanent && !dialog && (
                        <MdClose
                            className={`absolute top-4 right-4 cursor-pointer font-bold text-xl ${
                                variant === 'dark' && 'text-white'
                            }`}
                            onClick={() => setOpen(0)}
                        />
                    )}
                    {children}
                </div>
            </div>
        );
    }
    return <></>;
};

export default Modal;
