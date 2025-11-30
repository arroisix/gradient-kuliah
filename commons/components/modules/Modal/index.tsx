import { MdClose } from 'react-icons/md';
import { ReactNode } from 'react';
import { cn } from 'commons/utils';

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
            <>
                <div
                    aria-hidden={true}
                    className="modal modal-open modal-bottom md:modal-middle min-h-[100px]"
                    onClick={(e) => e.stopPropagation()}>
                    <div
                        className={cn(
                            'relative modal-box',
                            dialog || variant == 'dark'
                                ? 'bg-violet-2 text-white'
                                : 'bg-white text-black ',
                            isPopup && 'md:max-w-[365px]',
                            className
                        )}>
                        {!permanent && !dialog && (
                            <div className="modal-action">
                                <button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">
                                    <MdClose
                                        className={cn(
                                            'font-bold text-xl',
                                            variant === 'dark' && 'text-white'
                                        )}
                                        onClick={() => setOpen(false)}
                                    />
                                </button>
                            </div>
                        )}

                        {children}
                    </div>
                    <div
                        className="modal-backdrop bg-black/75"
                        aria-hidden={true}
                        onClick={
                            permanent ? undefined : () => setOpen(false)
                        }></div>
                </div>
            </>
        );
    }
    return <></>;
};

export default Modal;
