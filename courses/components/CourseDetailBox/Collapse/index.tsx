import Skeleton from 'commons/components/elements/Skeleton';
import { useGetSubchapterQuery } from 'courses/redux/api/courseApi';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { HiCheck, HiOutlineChevronDown } from 'react-icons/hi';
import VideoItem from './VideoItem';
import ExerciseItem from './ExerciseItem';

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
    const { chapter } = router.query;

    const { data, isLoading } = useGetSubchapterQuery({
        chapterId: chapter_id
    });

    return (
        <div key={key} className="bg-[#1D1D1D] rounded">
            <div
                className={`flex justify-between gap-2 p-3 cursor-pointer ${
                    isOpen && 'border-b-[1px] border-[#2D2D2D]'
                }`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-hidden>
                <div className="w-[85%] flex items-center gap-2">
                    {is_finished ? (
                        <HiCheck size={18} className="text-[#02EC60]" />
                    ) : chapter === chapter_id ? (
                        <FaPlay size={14} />
                    ) : null}
                    <span className="inline-block overflow-hidden text-sm font-extrabold whitespace-nowrap text-ellipsis">
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
                {isLoading && <Skeleton className="h-[30px] !m-0" repeat={3} />}
                {!isLoading &&
                    data?.subchapters?.map((value) =>
                        value.type === 'video' ? (
                            <VideoItem
                                key={value.id}
                                value={value}
                                chapter_id={chapter_id}
                            />
                        ) : (
                            <ExerciseItem key={value.id} value={value} />
                        )
                    )}
            </div>
        </div>
    );
};

export default Collapse;
