/* eslint-disable @typescript-eslint/ban-ts-comment */
interface InputProps {
    label?: string;
    type: string;
    placeholder?: string;
    className?: string;
    onChange?: (res: any) => void;
    onBlur?: (res: any) => void;
    value?: string;
    name: string;
    startAddorment?: JSX.Element;
    endAddorment?: JSX.Element;
    disabled?: boolean;
    error?: string;
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
    error
}) => (
    <div className="flex flex-col my-4 w-full">
        <span className="mb-1 font-thin text-xs">{label}</span>
        <div
            className={`flex w-full items-center rounded-lg px-2 h-[48px] border ${
                error ? 'border-red-500' : 'border-neutral-400'
            } ${className}`}>
            <div>{startAddorment}</div>
            <input
                type={type}
                className={`form-input bg-transparent border-0 w-full focus:outline-none focus:ring-0 focus:appearance-none`}
                placeholder={placeholder}
                onChange={onChange}
                // @ts-ignore
                onWheel={(e) => e.target.blur()}
                onBlur={onBlur}
                value={value}
                name={name}
                disabled={disabled}
            />
            <div>{endAddorment}</div>
        </div>
        {error && (
            <span className="font-thin text-red-500 text-sm mt-2">{error}</span>
        )}
    </div>
);

export default Input;
