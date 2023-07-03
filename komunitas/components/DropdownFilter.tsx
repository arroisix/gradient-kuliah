import React from 'react';

const DropdownFilter = ({
    onChange,
    options
}: {
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options?: SubjectCategoriesResponse;
}): JSX.Element => {
    return (
        <select
            className={`w-1/2 md:w-fit pl-[18px] pr-[50px] border-none bg-[#2C2C2C] rounded-[70px] text-xs font-bold cursor-pointer focus:outline-none focus:ring-0 focus:appearance-none`}
            onChange={onChange}
            name={'name'}>
            <option className="pt-4" key="" value="" label="Semua">
                Semua
            </option>
            {options?.categories?.map((option) => (
                <option
                    className="pt-4"
                    key={option.id}
                    value={option.id}
                    label={option.name}>
                    {option.name}
                </option>
            ))}
        </select>
    );
};

export default DropdownFilter;
