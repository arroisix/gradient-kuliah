import { ChangeEventHandler, FocusEventHandler } from 'react';

/* eslint-disable @typescript-eslint/ban-ts-comment */
interface InputProps {
    label?: string;
    placeholder?: string;
    className?: string;
    onChange?: ChangeEventHandler<HTMLTextAreaElement> | undefined;
    onBlur?: FocusEventHandler<HTMLTextAreaElement> | undefined;
    value?: string;
    name: string;
    startAddorment?: JSX.Element;
    endAddorment?: JSX.Element;
    disabled?: boolean;
    error?: string;
    required?: boolean;
}

const TextArea: React.FC<InputProps> = ({
    label,
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
    required
}) => (
    <div className="flex flex-col w-full gap-1 font-body">
        {label && <span className="text-[#999999] text-sm">{label}</span>}
        <div
            className={`flex w-full items-center rounded-lg p-2 border ${
                error ? 'border-red-500' : 'border-[#242424]'
            } ${className}`}>
            <div>{startAddorment}</div>
            <textarea
                className={`form-input bg-transparent border-0 w-full focus:outline-none focus:ring-0 focus:appearance-none placeholder-gray-300`}
                placeholder={placeholder}
                onChange={onChange}
                onWheel={(e) => (e.target as HTMLElement).blur()}
                onBlur={onBlur}
                value={value}
                name={name}
                disabled={disabled}
                required={required}
            />
            <div>{endAddorment}</div>
        </div>
        {error && <span className="mt-2 text-sm text-red-500">{error}</span>}
    </div>
);

export default TextArea;
