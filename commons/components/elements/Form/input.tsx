import { ChangeEventHandler, FocusEventHandler } from 'react';

/* eslint-disable @typescript-eslint/ban-ts-comment */
interface InputProps {
    label?: string;
    type: string;
    placeholder?: string;
    className?: string;
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
    onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
    value?: string;
    name: string;
    startAddorment?: JSX.Element;
    endAddorment?: JSX.Element;
    disabled?: boolean;
    error?: string;
    required?: boolean;
    autoComplete?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    type,
    placeholder,
    onChange,
    onBlur,
    value,
    className,
    name,
    startAddorment,
    endAddorment,
    disabled,
    error,
    required,
    autoComplete
}) => (
    <div className="flex flex-col w-full gap-1 font-body">
        {label && <span className="text-white text-sm">{label}</span>}
        <div
            className={`flex gap-2 w-full items-center rounded-lg px-4 h-[48px] bg-violet-2 border ${
                error ? 'border-red-500' : 'border-transparent'
            } ${className}`}>
            {startAddorment ? <div>{startAddorment}</div> : null}
            <input
                type={type}
                className={`p-0 bg-transparent border-0 w-full focus:outline-none focus:ring-0 focus:appearance-none placeholder:text-graphite-600`}
                placeholder={placeholder}
                onChange={onChange}
                onWheel={(e) => (e.target as HTMLElement).blur()}
                onBlur={onBlur}
                value={value}
                name={name}
                disabled={disabled}
                required={required}
                autoComplete={autoComplete}
            />
            {endAddorment ? <div>{endAddorment}</div> : null}
        </div>
        {error && <span className="mt-2 text-sm text-red-500">{error}</span>}
    </div>
);

export default Input;
