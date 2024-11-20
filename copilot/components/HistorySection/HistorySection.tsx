import { IoClose } from 'react-icons/io5';
import { BiSearch } from 'react-icons/bi';
import { BsPencil } from 'react-icons/bs';
import { AiOutlineHistory } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { cn } from 'commons/utils';

interface HistorySectionProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

const HISTORY_ITEMS: any[] = [
    // {
    //     title: 'Percepatan Sebagai Vektor',
    //     preview:
    //         'Percepatan merupakan besaran vektor karena memiliki besar dan arah. Besaran vektor bias...',
    //     timestamp: '12 Jul 2024, 19.30'
    // },
    // {
    //     title: 'Rangkuman Purcell Turunan',
    //     preview:
    //         'Berikut adalah rangkuman Bab Turunan dalam buku Calculus oleh Edwin Purcell: 1. Konsep T...',
    //     timestamp: '12 Jul 2024, 19.30'
    // },
    // {
    //     title: 'Rangkuman Purcell Turunan',
    //     preview:
    //         'Berikut adalah rangkuman Bab Turunan dalam buku Calculus oleh Edwin Purcell: 1. Konsep T...',
    //     timestamp: '12 Jul 2024, 19.30'
    // },
    // {
    //     title: 'Rangkuman Purcell Turunan',
    //     preview:
    //         'Berikut adalah rangkuman Bab Turunan dalam buku Calculus oleh Edwin Purcell: 1. Konsep T...',
    //     timestamp: '12 Jul 2024, 19.30'
    // },
    // {
    //     title: 'Rangkuman Purcell Turunan',
    //     preview:
    //         'Berikut adalah rangkuman Bab Turunan dalam buku Calculus oleh Edwin Purcell: 1. Konsep T...',
    //     timestamp: '12 Jul 2024, 19.30'
    // }
];

const HistorySection = ({
    isOpen,
    onClose,
    onOpen
}: HistorySectionProps): JSX.Element => {
    const hasHistory = HISTORY_ITEMS.length > 0;
    return (
        <div
            className={cn(
                'transition-all duration-300 ease-in-out',
                isOpen ? 'w-80' : 'w-16',
                'bg-neutral-900 h-screen flex flex-col'
            )}>
            {!isOpen ? (
                <button
                    onClick={onOpen}
                    className="flex justify-center pt-4 w-full text-white hover:text-neutral-400 transition-colors duration-200">
                    <AiOutlineHistory size={24} />
                </button>
            ) : (
                <>
                    <div className="shrink-0 p-4 flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className="transition-colors duration-200">
                            <IoClose size={24} />
                        </button>
                        <button className="p-2 rounded-lg transition-colors duration-200">
                            <BsPencil size={20} />
                        </button>
                    </div>

                    <div className="shrink-0 px-4 mb-4">
                        <div className="flex items-center gap-2 bg-[#222222] px-4 py-2 rounded-full">
                            <BiSearch className="text-neutral-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari percakapan"
                                className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full"
                            />
                        </div>
                    </div>

                    <div className="shrink-0 flex border-t border-neutral-800 pt-2 mb-4">
                        <button className="flex-1 py-2 font-bold border-b-2 border-[#5F2BCE] text-sm">
                            Riwayat
                        </button>
                        <button className="flex-1 py-2 text-neutral-400 hover:bg-[#222222] text-sm transition-colors duration-200">
                            Bookmark
                        </button>
                    </div>

                    <div className="flex flex-col min-h-0 flex-1">
                        {hasHistory ? (
                            <div className="overflow-y-auto px-2 flex-1">
                                {HISTORY_ITEMS.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-3 hover:bg-[#222222] rounded-lg cursor-pointer group">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-semibold text-sm mb-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-neutral-400 line-clamp-2">
                                                    {item.preview}
                                                </p>
                                            </div>
                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <BsThreeDotsVertical className="text-neutral-400" />
                                            </button>
                                        </div>
                                        <span className="text-xs text-neutral-500 mt-2 block">
                                            {item.timestamp}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <p className="text-base font-medium">
                                    Kamu belum pernah memulai percakapan
                                </p>
                                <p className="text-sm text-neutral-400 mt-2">
                                    Riwayat percakapanmu dengan Copilot AI akan
                                    tersimpan di sini
                                </p>
                            </div>
                        )}

                        <div className="shrink-0 p-4 border-t border-neutral-800">
                            <div className="bg-[#222222] p-4 rounded-lg">
                                <div className="flex items-center gap-1 justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-sm">
                                            Energi Harian
                                        </h3>
                                        <p className="text-xs text-neutral-400">
                                            Untuk bertanya, jumlah diberbatasi
                                            setiap hari
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-0.5 bg-[#333333] pl-1 pr-2 py-1 rounded-md">
                                        <span className="text-yellow-500">
                                            ⚡
                                        </span>
                                        <span>4</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HistorySection;
