interface SelectProps {
    option: { key: string; value: string }[];
    label?: string;
    onChange?: (res: any) => void;
    onBlur?: (res: any) => void;
    value?: string;
    name: string;
    required?: boolean;
}

const Select: React.FC<SelectProps> = ({
    option,
    label,
    onChange,
    onBlur,
    value,
    name,
    required
}) => {
    return (
        <div className="flex flex-col w-full gap-1 font-body">
            {label && <span className="text-[#999999] text-sm">{label}</span>}
            <select
                className="rounded-lg border bg-[#121212] border-[#242424] h-[48px]"
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
        </div>
    );
};

export default Select;
