import Modal from 'commons/components/modules/Modal';
import { cn } from 'commons/utils';
import { MdClose } from 'react-icons/md';
import { BiSearch, BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { useState } from 'react';
import Button from 'commons/components/elements/Button';

interface Option {
    value: string;
    label: string;
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseOptions: Option[];
    universityOptions: Option[];
    selectedCourse?: string;
    selectedUniversity?: string;
    selectedStatus?: string;
    selectedType?: string;
    onApply: (
        courseId: string,
        universityName: string,
        status: string,
        type: string
    ) => void;
}

type TabType = 'Mata Kuliah' | 'Universitas' | 'Status Pengerjaan' | 'Tipe';

const FilterModal = ({
    isOpen,
    onClose,
    courseOptions,
    universityOptions,
    selectedCourse = '',
    selectedUniversity = '',
    selectedStatus = 'all',
    selectedType = 'all',
    onApply
}: FilterModalProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState<TabType>('Mata Kuliah');
    const [expandedSections, setExpandedSections] = useState<TabType[]>([
        'Mata Kuliah'
    ]);
    const [showAllSections, setShowAllSections] = useState<TabType[]>([]);
    const [tempCourse, setTempCourse] = useState(selectedCourse);
    const [tempUniversity, setTempUniversity] = useState(selectedUniversity);
    const [tempStatus, setTempStatus] = useState(selectedStatus);
    const [tempType, setTempType] = useState(selectedType);
    const [searchQueries, setSearchQueries] = useState<Record<TabType, string>>(
        {
            'Mata Kuliah': '',
            Universitas: '',
            'Status Pengerjaan': '',
            Tipe: ''
        }
    );

    const tabs: TabType[] = [
        'Mata Kuliah',
        'Universitas',
        'Status Pengerjaan',
        'Tipe'
    ];

    const toggleSection = (tab: TabType) => {
        setExpandedSections((prev) =>
            prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab]
        );
    };

    const toggleShowAll = (tab: TabType) => {
        setShowAllSections((prev) =>
            prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab]
        );
    };

    const getCurrentOptions = (tab: TabType): Option[] => {
        switch (tab) {
            case 'Mata Kuliah':
                return courseOptions;
            case 'Universitas':
                return universityOptions;
            case 'Status Pengerjaan':
                return [
                    { value: 'all', label: 'Semua' },
                    { value: 'not_started', label: 'Belum Dikerjakan' },
                    { value: 'in_progress', label: 'Sedang Dikerjakan' },
                    { value: 'completed', label: 'Selesai' }
                ];
            case 'Tipe':
                return [
                    { value: 'all', label: 'Semua Tipe' },
                    { value: 'EXERCISE', label: 'Latihan' },
                    { value: 'TRYOUT', label: 'Try Out' }
                ];
            default:
                return [];
        }
    };

    const getCurrentSelected = (tab: TabType): string => {
        switch (tab) {
            case 'Mata Kuliah':
                return tempCourse;
            case 'Universitas':
                return tempUniversity;
            case 'Status Pengerjaan':
                return tempStatus;
            case 'Tipe':
                return tempType;
            default:
                return '';
        }
    };

    const handleSelect = (tab: TabType, value: string) => {
        switch (tab) {
            case 'Mata Kuliah':
                setTempCourse(value);
                break;
            case 'Universitas':
                setTempUniversity(value);
                break;
            case 'Status Pengerjaan':
                setTempStatus(value);
                break;
            case 'Tipe':
                setTempType(value);
                break;
        }
    };

    const getFilteredOptions = (tab: TabType): Option[] => {
        const options = getCurrentOptions(tab);
        const query = searchQueries[tab];
        if (!query.trim()) return options;
        return options.filter((option) =>
            option.label.toLowerCase().includes(query.toLowerCase())
        );
    };

    const handleReset = () => {
        setTempCourse('');
        setTempUniversity('');
        setTempStatus('');
        setTempType('');
        setSearchQueries({
            'Mata Kuliah': '',
            Universitas: '',
            'Status Pengerjaan': '',
            Tipe: ''
        });
    };

    const handleApply = () => {
        onApply(tempCourse, tempUniversity, tempStatus, tempType);
        onClose();
    };

    const handleClose = () => {
        setTempCourse(selectedCourse);
        setTempUniversity(selectedUniversity);
        setTempStatus(selectedStatus);
        setTempType(selectedType);
        setSearchQueries({
            'Mata Kuliah': '',
            Universitas: '',
            'Status Pengerjaan': '',
            Tipe: ''
        });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            setOpen={handleClose}
            variant="dark"
            permanent={true}
            className="!max-w-[700px] !w-full md:!w-[60vw] h-[80vh] md:h-[460px] !rounded-t-2xl md:!rounded-2xl !rounded-b-none md:!rounded-b-2xl fixed bottom-0 md:relative left-0 right-0 !max-h-[80vh] flex flex-col !overflow-hidden bg-[#20222E] p-4">
            <div className="flex flex-col w-full h-full gap-4">
                {/* Header */}
                <div className="flex items-center justify-between py-4 md:border-b border-[#282B3C] flex-shrink-0">
                    <h2 className="text-base font-semibold">Filter</h2>
                    <button
                        onClick={handleClose}
                        className="text-[#4D5165] hover:text-neutral-300 transition-colors">
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Desktop: Tabs */}
                <div className="hidden md:flex gap-2 overflow-x-auto flex-shrink-0 border-neutral-700">
                    {tabs.map((tab) => (
                        <Button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                            }}
                            variant="custom"
                            className={cn(
                                '!px-3 !py-3 !rounded-lg whitespace-nowrap !font-semibold !text-sm',
                                activeTab === tab
                                    ? '!bg-[#5F2BCE] text-white'
                                    : '!bg-[#282B3C] text-[#8B8FA3] hover:text-white'
                            )}>
                            {tab}
                        </Button>
                    ))}
                </div>

                {/* Desktop: Search Bar */}
                {getCurrentOptions(activeTab).length > 5 && (
                    <div className="hidden md:block flex-shrink-0">
                        <div className="relative">
                            <BiSearch
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4D5165]"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder={`Cari ${activeTab.toLowerCase()}`}
                                value={searchQueries[activeTab]}
                                onChange={(e) =>
                                    setSearchQueries((prev) => ({
                                        ...prev,
                                        [activeTab]: e.target.value
                                    }))
                                }
                                className="w-full bg-[#20222E] text-white placeholder:text-[#4D5165] rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-[#3A3D4A]"
                            />
                        </div>
                    </div>
                )}

                {/* Desktop: Options List */}
                <div
                    className={cn(
                        'hidden md:grid grid-flow-row justify-items-start gap-3 overflow-y-auto h-full content-start',
                        getFilteredOptions(activeTab).length > 5
                            ? 'grid-cols-3'
                            : 'grid-cols-1'
                    )}>
                    {getFilteredOptions(activeTab).map(({ value, label }) => (
                        <label
                            key={value}
                            htmlFor={`filter-modal-desktop-${value}`}
                            className={cn(
                                'flex items-center gap-2 w-full cursor-pointer'
                            )}>
                            <input
                                type="radio"
                                id={`filter-modal-desktop-${value}`}
                                name={`filter-modal-${activeTab}`}
                                value={value}
                                checked={
                                    value === getCurrentSelected(activeTab)
                                }
                                onChange={() => handleSelect(activeTab, value)}
                                className="radio radio-sm checked:bg-[#B6A6F3] border-[#4D5165] bg-transparent hover:checked:bg-accent-purple focus:checked:bg-[#B6A6F3]"
                            />
                            <span className="text-sm flex-1">{label}</span>
                        </label>
                    ))}
                    {getFilteredOptions(activeTab).length === 0 && (
                        <div className="text-center py-8 text-[#4D5165] text-sm col-span-full">
                            Tidak ada hasil ditemukan
                        </div>
                    )}
                </div>

                {/* Mobile: Accordion Sections */}
                <div className="md:hidden flex-1 overflow-y-auto space-y-2 overscroll-contain">
                    {tabs.map((tab) => {
                        const isExpanded = expandedSections.includes(tab);
                        const filteredOptions = getFilteredOptions(tab);
                        const allOptions = getCurrentOptions(tab);
                        const showAll = showAllSections.includes(tab);
                        const displayedOptions = showAll
                            ? filteredOptions
                            : filteredOptions.slice(0, 5);
                        const hasMore = filteredOptions.length > 5;
                        const showSearchBar = allOptions.length > 5;

                        return (
                            <div key={tab} className="">
                                {/* Accordion Header */}
                                <button
                                    onClick={() => toggleSection(tab)}
                                    className="w-full flex items-center justify-between py-4 border-b border-[#282B3C]">
                                    <span className="font-semibold text-sm">
                                        {tab}
                                    </span>
                                    {isExpanded ? (
                                        <BiChevronUp size={20} />
                                    ) : (
                                        <BiChevronDown size={20} />
                                    )}
                                </button>

                                {/* Accordion Content */}
                                {isExpanded && (
                                    <div className="space-y-3 bg-[#20222E] py-4">
                                        {/* Search Bar */}
                                        {showSearchBar && (
                                            <div className="relative">
                                                <BiSearch
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4D5165]"
                                                    size={18}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder={`Cari ${tab.toLowerCase()}`}
                                                    value={searchQueries[tab]}
                                                    onChange={(e) =>
                                                        setSearchQueries(
                                                            (prev) => ({
                                                                ...prev,
                                                                [tab]: e.target
                                                                    .value
                                                            })
                                                        )
                                                    }
                                                    className="w-full bg-[#20222E] text-white placeholder:text-[#4D5165] rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-[#3A3D4A]"
                                                />
                                            </div>
                                        )}

                                        {/* Options */}
                                        <div className="space-y-2">
                                            {displayedOptions.map(
                                                ({ value, label }) => (
                                                    <label
                                                        key={value}
                                                        htmlFor={`filter-modal-mobile-${tab}-${value}`}
                                                        className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            id={`filter-modal-mobile-${tab}-${value}`}
                                                            name={`filter-modal-mobile-${tab}`}
                                                            value={value}
                                                            checked={
                                                                value ===
                                                                getCurrentSelected(
                                                                    tab
                                                                )
                                                            }
                                                            onChange={() =>
                                                                handleSelect(
                                                                    tab,
                                                                    value
                                                                )
                                                            }
                                                            className="radio radio-sm checked:bg-[#B6A6F3] border-[#4D5165] bg-transparent hover:checked:bg-accent-purple focus:checked:bg-[#B6A6F3]"
                                                        />
                                                        <span className="text-sm flex-1">
                                                            {label}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                            {filteredOptions.length === 0 && (
                                                <div className="text-center py-4 text-[#4D5165] text-sm">
                                                    Tidak ada hasil ditemukan
                                                </div>
                                            )}
                                        </div>

                                        {/* Show More Link */}
                                        {hasMore && !showAll && (
                                            <button
                                                onClick={() =>
                                                    toggleShowAll(tab)
                                                }
                                                className="text-[#B6A6F3] text-sm w-full text-center hover:underline">
                                                Lihat Semua ↓
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 border-t border-[#282B3C] flex-shrink-0 w-full justify-end pt-4">
                    <Button
                        onClick={handleReset}
                        variant="secondary"
                        className="w-full md:w-auto">
                        Reset
                    </Button>
                    <Button
                        onClick={handleApply}
                        variant="primary"
                        className="w-full md:w-auto">
                        Terapkan
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default FilterModal;
