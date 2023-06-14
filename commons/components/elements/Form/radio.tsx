import { useState } from 'react';

type RadioOption = {
    key: string;
    value: string;
};

interface RadioProps {
    label?: string;
    onChange: (res: unknown) => void;
    onBlur: (res: unknown) => void;
    value?: string;
    name: string;
    options: Array<RadioOption>;
}

const Radio = ({
    label,
    onChange,
    onBlur,
    value,
    name,
    options
}: RadioProps): JSX.Element => {
    const [radioValue, setValue] = useState(value ?? options[0]?.key);

    const changeValue = (data: RadioOption): void => {
        setValue(data.key);
        onChange({
            target: {
                value: data.key,
                name: name
            }
        });
        onBlur({
            target: {
                value: data.key,
                name: name
            }
        });
    };

    return (
        <div className="flex flex-col w-full gap-1 font-body">
            {label && <span className="text-[#999999] text-sm">{label}</span>}
            <div className="flex flex-wrap ">
                {options.map((option: RadioOption) => (
                    <div
                        className={`cursor-pointer py-2 px-5 rounded-full border mr-2 mb-2  ${
                            radioValue === option.key
                                ? 'bg-[#7264EB] border-[#5F2BCE] text-white'
                                : 'bg-[#121212] border-[#242424]'
                        }`}
                        key={option.key}
                        onClick={() => changeValue(option)}
                        aria-hidden={true}>
                        {option.value}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Radio;
