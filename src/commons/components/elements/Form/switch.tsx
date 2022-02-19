interface SwitchProps {
    checked: boolean;
    setChecked: (checked: boolean) => void;
    label?: string;
}

const Switch = ({ checked, setChecked, label }: SwitchProps) => {
    return (
        <div className="flex items-center justify-center ">
            <span className="mr-1">{label}</span>
            <input
                type="checkbox"
                name="toggle"
                className="hidden"
                readOnly
                checked={checked}
            />
            <label
                className="relative w-8 h-4 flex select-none cursor-pointer items-center"
                htmlFor="toggle"
                onClick={() => setChecked(!checked)}
                aria-hidden={true}>
                <span
                    className={`absolute left-0 top-0 h-full w-full rounded-full ${
                        checked
                            ? 'bg-[#BB86FC61]'
                            : 'bg-[#616161] border-gray-500'
                    }`}></span>
                <span
                    className={`h-5 w-5 absolute z-10 rounded-full  transition-transform duration-300 ease-in-out flex justify-center items-center  transform  ${
                        checked
                            ? 'translate-x-3 bg-accent-purple'
                            : 'bg-[#B0B0B0]'
                    }`}></span>
            </label>
        </div>
    );
};

export default Switch;
