import { cn } from 'commons/utils';
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
        <div className="flex flex-col w-full gap-2 font-body">
            {label && <span className="text-white text-sm">{label}</span>}
            <div className="flex flex-wrap gap-2">
                {options.map((option: RadioOption) => (
                    <div
                        className={cn(
                            'cursor-pointer py-2 px-4 rounded-full text-base',
                            radioValue === option.key
                                ? 'bg-accent-purple text-white font-semibold'
                                : 'bg-[#333540]'
                        )}
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
