import { useEffect, useState } from 'react';
import { GroupBase, default as ReactSelect } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
import AsyncSelect, { AsyncProps } from 'react-select/async';

export interface SelectProps {
    option: Option[];
    label?: string;
    onChange?: (res: any) => void;
    name: string;
    error?: string;
    placeholder?: string;
    initialValue?: string;
    // For creatable select
    isCreatable?: boolean;
    // For async select
    isAsync?: boolean;
    loadOption?: AsyncProps<Option, false, GroupBase<Option>>['loadOptions'];
}

const Select: React.FC<SelectProps> = ({
    option,
    label,
    onChange,
    name,
    error,
    placeholder,
    initialValue,
    isCreatable,
    isAsync,
    loadOption
}) => {
    const [chosen, setChosen] = useState<Option | null>(null);

    useEffect(() => {
        if (initialValue) {
            if (!isAsync) {
                const matchingOption = option.find(
                    (item) => item.value === initialValue
                );
                if (matchingOption) {
                    setChosen(matchingOption);
                }
            } else {
                setChosen({
                    value: initialValue,
                    label: initialValue
                });
            }
        }
    }, [initialValue, option]);

    const onOptionChange = (val: any) => {
        onChange && onChange(val ? val.value : null);
        setChosen(val);
    };

    const SelectComponent =
        isCreatable && isAsync
            ? AsyncCreatableSelect
            : isCreatable
              ? CreatableSelect
              : isAsync
                ? AsyncSelect
                : ReactSelect;

    return (
        <div className="flex flex-col w-full gap-1 font-body">
            {label && <span className="text-[#999999] text-sm">{label}</span>}
            <SelectComponent
                isClearable
                options={option}
                placeholder={placeholder && placeholder}
                loadOptions={loadOption}
                name={name}
                value={chosen}
                onChange={onOptionChange}
                styles={{
                    control: (base) => ({
                        ...base,
                        minHeight: '48px',
                        background: '#121212',
                        borderRadius: '0.5rem',
                        borderWidth: '1px',
                        borderColor: error ? '#ef4444' : '#242424',
                        boxShadow: 'none',
                        '&:hover': {
                            borderColor: error ? '#ef4444' : '#242424'
                        }
                    }),
                    menu: (base) => ({
                        ...base,
                        background: '#121212',
                        borderRadius: '0.5rem',
                        marginTop: 0,
                        zIndex: 100
                    }),
                    option: (base, { isFocused }) => ({
                        ...base,
                        background: isFocused ? '#242424' : undefined,
                        color: 'white'
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: 'white'
                    }),
                    clearIndicator: (base) => ({
                        ...base,
                        color: 'white'
                    }),
                    dropdownIndicator: (base) => ({
                        ...base,
                        color: '#666666'
                    }),
                    input: (base) => ({
                        ...base,
                        color: 'white'
                    })
                }}
                components={{ IndicatorSeparator: () => null }}
            />
            {error && (
                <span className="mt-2 text-sm text-red-500">{error}</span>
            )}
        </div>
    );
};

export default Select;
