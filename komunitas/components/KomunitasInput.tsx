import { ChangeEventHandler } from 'react';

const KomunitasInput = ({
    type,
    placeholder,
    onChange,
    value,
    className,
    name
}: {
    type: string;
    placeholder?: string;
    onChange: ChangeEventHandler<HTMLInputElement> | undefined;
    value: string;
    className?: string;
    name: string;
}): JSX.Element => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full text-xs bg-[#1D1D1D] rounded-[70px] border-none placeholder:text-neutral-600 focus:outline-none focus:ring-0 focus:appearance-none ${className}`}
        />
    );
};

export default KomunitasInput;
