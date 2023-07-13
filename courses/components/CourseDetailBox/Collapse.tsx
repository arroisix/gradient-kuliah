import { useGetLandingCourseListContentQuery } from 'courses/redux/api/publicCourseApi';
import { getAllChapterContent } from 'courses/utils';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HiCheck, HiOutlineChevronDown, HiPlay } from 'react-icons/hi';

const Collapse = ({
    key,
    title,
    chapter_id,
    is_finished,
    initialOpen = false
}: {
    key?: string;
    title: string;
    chapter_id: string;
    is_finished: boolean;
    initialOpen?: boolean;
}): JSX.Element => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const router = useRouter();
    const { id, sub } = router.query;

    // change get data. integrate with new API
    const { data: content } = useGetLandingCourseListContentQuery(
        id as string,
        {
            skip: !id
        }
    );
    const chapters = getAllChapterContent(content?.data as Chapter[]);
    const filteredChapter = chapters.filter(
        (value) => value.id === chapter_id
    )[0];

    return (
        <div key={key} className="bg-[#1D1D1D] rounded">
            <div
                className={`flex justify-between gap-2 p-3 cursor-pointer ${
                    isOpen && 'border-b-[1px] border-[#2D2D2D]'
                }`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-hidden>
                <div className="w-[85%] flex gap-2">
                    {is_finished && (
                        <HiCheck size={18} className="text-[#02EC60]" />
                    )}
                    <span className="inline-block font-extrabold text-sm whitespace-nowrap text-ellipsis overflow-hidden">
                        {title}
                    </span>
                </div>
                <HiOutlineChevronDown
                    size={18}
                    className={`w-[18px] h-[18px] text-white ${
                        isOpen ? 'rotate-180' : ''
                    } transition-all`}
                />
            </div>
            <div className={`${isOpen ? '' : 'hidden'}`}>
                {/* change mapping logic */}
                {filteredChapter.subchapters.map((value) => (
                    <div
                        key={value.id}
                        className="flex justify-between px-3 py-[10px] cursor-pointer hover:bg-[#272727]"
                        onClick={() =>
                            router.push(
                                `/kelas/${id}/belajar/video/${chapter_id}/${value.id}`
                            )
                        }
                        aria-hidden>
                        <div
                            className={`flex items-center gap-[10px] ${
                                sub === value.id ? 'w-[65%]' : 'w-[80%]'
                            }`}>
                            <div className="w-[18px] h-[18px]">
                                {sub === value.id ? (
                                    <div className="w-[18px] h-[18px] relative flex justify-center items-center">
                                        <div
                                            className="radial-progress"
                                            style={
                                                {
                                                    '--value': '70',
                                                    '--size': '15px',
                                                    '--thickness': '2px'
                                                } as React.CSSProperties
                                            }></div>
                                        <div
                                            className="radial-progress absolute"
                                            style={
                                                {
                                                    color: '#FFFFFF1A',
                                                    '--value': '100',
                                                    '--size': '15px',
                                                    '--thickness': '2px'
                                                } as React.CSSProperties
                                            }></div>
                                    </div>
                                ) : (
                                    <HiPlay size={18} />
                                )}
                            </div>
                            <span className="inline-block font-body text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                                {value.subchapter_name}
                            </span>
                        </div>
                        <div className="flex gap-1 font-body text-xs">
                            {sub === value.id && (
                                <>
                                    <span className="inline-block">02:08</span>
                                    <span className="inline-block text-[#FFFFFF80]">
                                        /
                                    </span>
                                </>
                            )}
                            <span className="inline-block text-[#FFFFFF80]">
                                07:25
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Collapse;
