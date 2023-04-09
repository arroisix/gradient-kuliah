import { useState } from 'react';

type RadioOption = {
    key: string;
    value: string;
};

interface RadioProps {
    label?: string;
    onChange: (res: any) => void;
    onBlur: (res: any) => void;
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
        <div className="flex flex-col my-4 w-full">
            <span className="mb-1 text-xs">{label}</span>
            <div className="flex flex-wrap -mb-2">
                {options.map((option: RadioOption) => (
                    <div
                        className={`cursor-pointer py-2 px-5 rounded-full mr-2 mb-2  ${
                            radioValue === option.key
                                ? 'bg-accent-blue text-white'
                                : 'bg-neutral-100'
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
