interface SelectProps {
    option: { key: string; value: string }[];
    label?: string;
    onChange?: (res: any) => void;
    onBlur?: (res: any) => void;
    value?: string;
    name: string;
    required?: boolean;
    error?: string;
}

const Select: React.FC<SelectProps> = ({
    option,
    label,
    onChange,
    onBlur,
    value,
    name,
    required,
    error
}) => {
    return (
        <div className="flex flex-col w-full gap-1 font-body">
            {label && <span className="text-[#999999] text-sm">{label}</span>}
            <select
                className={`rounded-lg h-[48px] border bg-[#121212] ${
                    error ? 'border-red-500' : 'border-[#242424]'
                }`}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                name={name}
                required={required}>
                {option.map((o) => (
                    <option key={o.key} value={o.key} label={o.value}>
                        {o.value}
                    </option>
                ))}
            </select>
            {error && (
                <span className="mt-2 text-sm text-red-500">{error}</span>
            )}
        </div>
    );
};

export default Select;
