import { ChangeEventHandler, ReactNode } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

type KomunitasInputProps = {
    type: string;
    placeholder?: string;
    onChange:
        | ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
        | undefined;
    value: string;
    className?: string;
    name: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    handleSubmit: () => void | Promise<void>;
    isSubmitOnEnter?: boolean;
};

const KomunitasInput = ({
    type,
    placeholder,
    onChange,
    value,
    className,
    name,
    leftIcon,
    rightIcon,
    isSubmitOnEnter = true,
    handleSubmit
}: KomunitasInputProps): JSX.Element => {
    return (
        <div className="w-full flex items-center gap-2 bg-[#1D1D1D] rounded-box px-4 py-[9px]">
            {leftIcon}
            {!isSubmitOnEnter ? (
                <TextareaAutosize
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    cols={1}
                    onKeyDown={(event) => {
                        if (
                            (event.ctrlKey || event.metaKey) &&
                            event.key === 'Enter'
                        )
                            handleSubmit();
                    }}
                    className={`w-full text-xs p-0 bg-transparent border-none placeholder:text-neutral-600 focus:outline-none focus:ring-0 focus:appearance-none ${className}`}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onKeyDown={(event) => {
                        event.key === 'Enter' ? handleSubmit() : null;
                    }}
                    className={`w-full text-xs p-0 bg-transparent border-none placeholder:text-neutral-600 focus:outline-none focus:ring-0 focus:appearance-none ${className}`}
                />
            )}
            {rightIcon}
        </div>
    );
};

export default KomunitasInput;
