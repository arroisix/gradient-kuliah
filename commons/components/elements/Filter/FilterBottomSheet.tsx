import Modal from 'commons/components/modules/Modal';
import { cn } from 'commons/utils';
import { BiSearch } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';
import { useState, useMemo } from 'react';

interface Option {
    value: string;
    label: string;
}

interface FilterBottomSheetProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    options: Option[];
    selectedValue?: string;
    onSelect: (value: string) => void;
    title?: string;
}

const FilterBottomSheet = ({
    isOpen,
    setOpen,
    options,
    selectedValue,
    onSelect,
    title = 'Pilih Filter'
}: FilterBottomSheetProps): JSX.Element => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return options;
        return options.filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    const handleSelect = (value: string) => {
        onSelect(value);
        setSearchQuery('');
        setOpen(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            setOpen={setOpen}
            variant="dark"
            permanent={true}
            className="!max-w-full !w-full !m-0 !rounded-t-2xl !rounded-b-none fixed bottom-0 left-0 right-0 !max-h-[70vh] flex flex-col p-0 !overflow-hidden bg-[#20222E]">
            <div className="flex flex-col w-full h-[70vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4 flex-shrink-0">
                    <h2 className="text-base font-semibold">{title}</h2>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-[#4D5165] hover:text-neutral-300 transition-colors">
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 flex-shrink-0">
                    <div className="relative">
                        <BiSearch
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4D5165]"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder={`Cari ${title.toLowerCase()}`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#191920] text-white placeholder:text-[#4D5165] rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 border-none"
                        />
                    </div>
                </div>

                {/* Options List */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {filteredOptions.map(({ value, label }) => (
                        <label
                            key={value}
                            htmlFor={`filter-${value}`}
                            className={cn(
                                'flex items-center gap-3 w-full px-4 py-3 cursor-pointer transition-colors',
                                value === selectedValue && 'bg-neutral-800/30'
                            )}>
                            <input
                                type="radio"
                                id={`filter-${value}`}
                                name="filter-option"
                                value={value}
                                checked={value === selectedValue}
                                onChange={() => handleSelect(value)}
                                className="radio radio-sm checked:bg-[#B6A6F3] border-[#4D5165] bg-transparent"
                            />
                            <span className="text-sm flex-1">{label}</span>
                        </label>
                    ))}
                    {filteredOptions.length === 0 && (
                        <div className="text-center py-8 text-[#4D5165] text-sm">
                            Tidak ada hasil ditemukan
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default FilterBottomSheet;
