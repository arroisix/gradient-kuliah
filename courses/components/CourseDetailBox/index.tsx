import { useState } from 'react';
import ProgressBar from './ProgressBar';
import { MdStarPurple500 } from 'react-icons/md';
import { IoIosSearch } from 'react-icons/io';
import Collapse from './Collapse';

const Accordion = (): JSX.Element => {
    return (
        <Collapse
            title="HALOhagSGDJHAG djasgd jagdjagghjasdoasudasdo as d asdjasjd asj dlasdasj"
            content={
                <div className="px-3 py-[10px] cursor-pointer hover:bg-[#272727]">
                    haolasl
                </div>
            }
        />
    );
};

const CourseDetailBox = (): JSX.Element => {
    const [navigation, setNavigation] = useState<'VIDEO' | 'BUKU'>('VIDEO');
    const [isSearch, setIsSearch] = useState(false);

    return (
        <div className="w-full h-full bg-[#121212] rounded-lg overflow-hidden">
            <div className="flex flex-col gap-[14px] px-[18px] py-[18px] bg-[#1D1D1D]">
                <div className="flex justify-between items-center">
                    <h4 className="font-sans font-extrabold text-base xl:text-lg">
                        Dasar Integral{' '}
                        <span className="font-body text-[#FFFFFF80]">
                            (6h 42m)
                        </span>
                    </h4>
                    <MdStarPurple500 size={20} className="text-neutral-400" />
                </div>
                <ProgressBar total_finished_video={2} total_video_count={40} />
            </div>
            <div className="flex flex-col gap-[18px] px-[14px] pt-[14px]">
                {isSearch ? (
                    <div onClick={() => setIsSearch(false)} aria-hidden>
                        Searhc state
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                            <span
                                className={`inline-block font-bold text-sm pb-[6px] cursor-pointer ${
                                    navigation === 'VIDEO'
                                        ? 'border-b-2 border-accent-purple'
                                        : 'text-neutral-600 border-none hover:text-neutral-500'
                                }`}
                                onClick={() => setNavigation('VIDEO')}
                                aria-hidden>
                                VIDEO
                            </span>
                            <span
                                className={`inline-block font-bold text-sm pb-[6px] cursor-pointer ${
                                    navigation === 'BUKU'
                                        ? 'border-b-2 border-accent-purple'
                                        : 'text-neutral-600 border-none hover:text-neutral-500'
                                }`}
                                onClick={() => setNavigation('BUKU')}
                                aria-hidden>
                                BUKU
                            </span>
                        </div>
                        <IoIosSearch
                            size={20}
                            className="text-[#DADADA]"
                            onClick={() => setIsSearch(true)}
                        />
                    </div>
                )}
                <div>
                    <Accordion />
                </div>
            </div>
        </div>
    );
};

export default CourseDetailBox;
