import Skeleton from 'commons/components/elements/Skeleton';
import { useGetSubchapterQuery } from 'courses/redux/api/courseApi';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { HiCheck, HiOutlineChevronDown } from 'react-icons/hi';
import VideoItem from './VideoItem';
import InteractiveExerciseItem from './InteractiveExerciseItem';

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
            <button
                className={`flex w-full justify-between gap-2 p-3 cursor-pointer ${
                    isOpen && 'border-b-[1px] border-[#2D2D2D]'
                }`}
                onClick={() => setIsOpen((prev) => !prev)}>
                <div className="flex items-center gap-2 grow">
                    {is_finished ? (
                        <HiCheck size={18} className="text-[#02EC60]" />
                    ) : chapter === chapter_id ? (
                        <FaPlay size={14} />
                    ) : null}
                    <h3 className="overflow-hidden text-sm font-extrabold text-left text-balance text-ellipsis">
                        {title}
                    </h3>
                </div>
                <HiOutlineChevronDown
                    size={18}
                    className={`w-[18px] h-[18px] text-white ${
                        isOpen ? 'rotate-180' : ''
                    } transition-all`}
                />
            </button>
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
                            <InteractiveExerciseItem
                                key={value.id}
                                value={value}
                                chapter_id={chapter_id}
                            />
                        )
                    )}
                {!isLoading && data?.subchapters.length === 0 && (
                    <div className="p-2">
                        <p className="text-sm text-graphite-600">
                            Sabar ya, materi ini akan segera hadir untukmu.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collapse;
