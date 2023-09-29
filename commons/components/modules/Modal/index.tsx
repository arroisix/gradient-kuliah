import { MdClose } from 'react-icons/md';
import { ReactNode } from 'react';

interface ModalProps extends ModalBaseProps {
    children: ReactNode;
    permanent?: boolean;
    dialog?: boolean;
    variant?: 'light' | 'dark';
    isPopup?: boolean;
    className?: string;
}

const Modal = ({
    isOpen,
    setOpen,
    children,
    isPopup,
    className,
    permanent = false,
    dialog = false,
    variant = 'light'
}: ModalProps): JSX.Element => {
    if (isOpen) {
        return (
            <div
                aria-hidden={true}
                className="fixed inset-0 z-50 flex items-center justify-center shadow-sm bg-black/75"
                onClick={permanent ? undefined : () => setOpen(false)}>
                <div
                    aria-hidden={true}
                    className={`relative p-4 rounded-md z-100 ${
                        isPopup ? '' : 'w-[365px]'
                    } min-h-[100px] ${
                        dialog || variant == 'dark'
                            ? 'bg-neutral-800 text-white'
                            : 'bg-white text-black '
                    } ${className}`}
                    onClick={(e) => e.stopPropagation()}>
                    {!permanent && !dialog && (
                        <MdClose
                            className={`absolute top-4 right-4 cursor-pointer font-bold text-xl ${
                                variant === 'dark' && 'text-white'
                            }`}
                            onClick={() => setOpen(false)}
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
