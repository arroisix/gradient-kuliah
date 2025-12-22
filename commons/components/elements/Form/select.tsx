import { useEffect, useState } from 'react';
import { GroupBase, default as ReactSelect, SingleValue } from 'react-select';
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
    isSearchTarget?: boolean;
    // whether to show "x" button or not
    isClearable?: boolean;
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
    loadOption,
    isSearchTarget = false,
    isClearable = true
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
                let label = initialValue;
                if (isSearchTarget) {
                    // the format of "initialValue" is "institution_id:institution_name"
                    label = initialValue.split(':')[1];
                }

                setChosen({
                    value: initialValue,
                    label
                });
            }
        }
    }, [initialValue, option]);

    const onOptionChange = (val: SingleValue<Option>) => {
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
            {label && <span className="text-white text-sm">{label}</span>}
            <SelectComponent
                isClearable={isClearable}
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
                        background: '#20222E',
                        borderRadius: '0.5rem',
                        borderWidth: '1px',
                        borderColor: error ? '#ef4444' : 'transparent',
                        boxShadow: 'none',
                        padding: '0px 7px',
                        '&:hover': {
                            borderColor: error ? '#ef4444' : 'transparent'
                        }
                    }),
                    menu: (base) => ({
                        ...base,
                        background: '#333540',
                        borderRadius: '0.4rem',
                        marginTop: '0.5rem',
                        zIndex: 100
                    }),
                    option: (base, { isFocused }) => ({
                        ...base,
                        background: isFocused ? '#4a4c5c' : '#333540',
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
                        color: 'white',
                        'input:focus': {
                            boxShadow: 'none'
                        }
                    }),
                    placeholder: (base) => ({
                        ...base,
                        whiteSpace: 'nowrap'
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
