import { ChangeEventHandler, ReactNode } from 'react';

const KomunitasInput = ({
    type,
    placeholder,
    onChange,
    value,
    className,
    name,
    leftIcon,
    rightIcon,
    handleSubmit
}: {
    type: string;
    placeholder?: string;
    onChange: ChangeEventHandler<HTMLInputElement> | undefined;
    value: string;
    className?: string;
    name: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    handleSubmit: () => void | Promise<void>;
}): JSX.Element => {
    return (
        <div className="w-full flex items-center gap-2 bg-[#1D1D1D] rounded-[70px] px-4 py-[9px]">
            {leftIcon}
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
            {rightIcon}
        </div>
    );
};

export default KomunitasInput;
