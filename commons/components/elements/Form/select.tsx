import { useState } from 'react';
import {default as ReactSelect} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
import AsyncSelect from 'react-select/async';

interface SelectProps {
    option: Option[];
    label?: string;
    onChange?: (res: any) => void;
    onBlur?: (res: any) => void;
    value?: string;
    name: string;
    required?: boolean;
    error?: string;
    placeholder?: string;
    
    // For creatable select
    isCreatable?: boolean;
    handleCreate?: (value: any) => void;
    
    // For async select
    isAsync?: boolean;
    loadOption?: (res: any) => void;
}

const Select: React.FC<SelectProps> = ({
    option,
    label,
    onChange,
    onBlur,
    value,
    name,
    required,
    error,
    placeholder,
    
    isCreatable,
    handleCreate,
    
    isAsync,
    loadOption,
}) => {
    const [chosen, setChosen] = useState(null)
    const onOptionChange = (val: any) => {
        onChange && onChange(val ? val.value : null);
        setChosen(val);
    }

    return (
        <div className="flex flex-col w-full gap-1 font-body">
            {label && <span className="text-[#999999] text-sm">{label}</span>}
            {isCreatable ? (
                <>  
                    {isAsync ? (
                        <AsyncCreatableSelect 
                            isClearable
                            options={option}
                            placeholder={placeholder && placeholder}
                            loadOptions={loadOption}
                            name={name}
                            value={chosen}
                            onChange={onOptionChange}
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    minHeight: '48px',
                                    background: '#121212',
                                    borderRadius: '0.5rem',
                                    borderWidth: '1px',
                                    borderColor: '#242424',
                                    boxShadow: 'none',
                                    "&:hover": {
                                        borderColor: '#242424'
                                    }
                                }),
                                menu: (base) => ({
                                    ...base,
                                    background: '#121212',
                                    borderRadius: '0.5rem',
                                    marginTop: 0,
                                    zIndex: 100,
                                }),
                                option: (base, { isFocused }) => ({
                                    ...base,
                                    background: isFocused ? '#242424' : undefined,
                                    color: 'white'
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: 'white',
                                }),
                                clearIndicator: (base) => ({
                                    ...base,
                                    color: 'white'
                                }),
                                dropdownIndicator: (base, state) => ({
                                    ...base,
                                    color: '#666666',
                                }),
                                input: (base) => ({
                                    ...base,
                                    color: 'white'
                                }),
                            }}
                            components={{IndicatorSeparator: () => null}}
                        />
                    ) : (
                        <CreatableSelect 
                            isClearable
                            options={option}
                            placeholder={placeholder && placeholder}
                            name={name}
                            value={chosen}
                            onChange={onOptionChange}
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    minHeight: '48px',
                                    background: '#121212',
                                    borderRadius: '0.5rem',
                                    borderWidth: '1px',
                                    borderColor: '#242424',
                                    boxShadow: 'none',
                                    "&:hover": {
                                        borderColor: '#242424'
                                    }
                                }),
                                menu: (base) => ({
                                    ...base,
                                    background: '#121212',
                                    borderRadius: '0.5rem',
                                    marginTop: 0,
                                    zIndex: 100,
                                }),
                                option: (base, { isFocused }) => ({
                                    ...base,
                                    background: isFocused ? '#242424' : undefined,
                                    color: 'white'
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: 'white',
                                }),
                                clearIndicator: (base) => ({
                                    ...base,
                                    color: 'white'
                                }),
                                dropdownIndicator: (base, state) => ({
                                    ...base,
                                    color: '#666666',
                                }),
                                input: (base) => ({
                                    ...base,
                                    color: 'white'
                                }),
                            }}
                            components={{IndicatorSeparator: () => null}}
                        />
                    )}
                </>
            ) : (
                <>
                    {isAsync ? (
                        <AsyncSelect 
                            isClearable
                            options={option}
                            placeholder={placeholder && placeholder}
                            loadOptions={loadOption}
                            name={name}
                            value={chosen}
                            onChange={onOptionChange}
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    minHeight: '48px',
                                    background: '#121212',
                                    borderRadius: '0.5rem',
                                    borderWidth: '1px',
                                    borderColor: '#242424',
                                    boxShadow: 'none',
                                    "&:hover": {
                                        borderColor: '#242424'
                                    }
                                }),
                                menu: (base) => ({
                                    ...base,
                                    background: '#121212',
                                    borderRadius: '0.5rem',
                                    marginTop: 0,
                                    zIndex: 100,
                                }),
                                option: (base, { isFocused }) => ({
                                    ...base,
                                    background: isFocused ? '#242424' : undefined,
                                    color: 'white'
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: 'white',
                                }),
                                clearIndicator: (base) => ({
                                    ...base,
                                    color: 'white'
                                }),
                                dropdownIndicator: (base, state) => ({
                                    ...base,
                                    color: '#666666',
                                }),
                                input: (base) => ({
                                    ...base,
                                    color: 'white'
                                }),
                            }}
                            components={{IndicatorSeparator: () => null}}
                        />
                        ) : (
                        <ReactSelect 
                            isClearable
                            options={option}
                            placeholder={placeholder && placeholder}
                            name={name}
                            value={chosen}
                            onChange={onOptionChange}
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    minHeight: '48px',
                                    background: '#121212',
                                    borderRadius: '0.5rem',
                                    borderWidth: '1px',
                                    borderColor: '#242424',
                                    boxShadow: 'none',
                                    "&:hover": {
                                        borderColor: '#242424'
                                    }
                                }),
                                menu: (base) => ({
                                    ...base,
                                    background: '#121212',
                                    borderRadius: '0.5rem',
                                    marginTop: 0,
                                    zIndex: 100,
                                }),
                                option: (base, { isFocused }) => ({
                                    ...base,
                                    background: isFocused ? '#242424' : undefined,
                                    color: 'white'
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: 'white',
                                }),
                                clearIndicator: (base) => ({
                                    ...base,
                                    color: 'white'
                                }),
                                dropdownIndicator: (base, state) => ({
                                    ...base,
                                    color: '#666666',
                                }),
                                input: (base) => ({
                                    ...base,
                                    color: 'white'
                                }),
                            }}
                            components={{IndicatorSeparator: () => null}}
                        />
                    )}
                </>
            )}
            {error && (
                <span className="mt-2 text-sm text-red-500">{error}</span>
            )}
        </div>
    );
};

export default Select;
