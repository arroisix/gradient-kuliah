import Pen from 'commons/components/elements/Icons/Pen';
import Skeleton from 'commons/components/elements/Skeleton';
import Modal from 'commons/components/modules/Modal';
import { useGetSubchapterQuery } from 'courses/redux/api/courseApi';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { HiCheck, HiOutlineChevronDown, HiPlay } from 'react-icons/hi';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import WorksheetInfoModalContent from '../LearningExperience/ExamExercise/WorksheetInfoModal';

const ExerciseItem = ({ value }: { value: SubChapter }): JSX.Element => {
    const router = useRouter();
    const { sub } = router.query;

    const [openWorksheetInfo, setOpenWorksheetInfo] = useState<0 | 1>(0);

    return (
        <>
            <div
                key={value.id}
                className="flex justify-between px-3 py-[10px] cursor-pointer hover:bg-[#272727]"
                onClick={() => setOpenWorksheetInfo(1)}
                aria-hidden>
                <div
                    className={`flex items-center gap-[10px] ${
                        sub === value.id ? 'w-[65%]' : 'w-[80%]'
                    }`}>
                    <div className="w-[18px] h-[18px]">
                        <Pen />
                    </div>
                    <span className="inline-block font-body text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                        {value.exercise_name}
                    </span>
                </div>
            </div>
            <Modal
                isOpen={openWorksheetInfo}
                setOpen={setOpenWorksheetInfo}
                variant="dark">
                <WorksheetInfoModalContent
                    exercise_id={value.exercise_id as string}
                    packet_id={value.packet_id as string}
                />
            </Modal>
        </>
    );
};

const VideoItem = ({
    value,
    chapter_id
}: {
    value: SubChapter;
    chapter_id: string;
}): JSX.Element => {
    const router = useRouter();
    const { id, sub } = router.query;

    const totalDuration = value?.duration
        ?.split(':')
        ?.reverse()
        ?.reduce((prev, curr, i) => +prev + +curr * +Math.pow(60, i), 0);

    const totalLastDuration = value?.last_duration
        ?.split(':')
        ?.reverse()
        ?.reduce((prev, curr, i) => +prev + +curr * +Math.pow(60, i), 0);

    return (
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
                    {value.is_finished ? (
                        <IoIosCheckmarkCircle
                            size={18}
                            className="text-[#02EC60]"
                        />
                    ) : sub === value.id ? (
                        <div className="w-[18px] h-[18px] relative flex justify-center items-center">
                            <div
                                className="radial-progress"
                                style={
                                    {
                                        '--value': Math.floor(
                                            ((totalLastDuration ?? 0) /
                                                (totalDuration ?? 0)) *
                                                100
                                        ),
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
                {value.duration && (
                    <>
                        {sub === value.id && (
                            <>
                                <span className="inline-block">
                                    {value?.last_duration
                                        ? moment
                                              .utc(
                                                  (totalLastDuration as number) *
                                                      1000
                                              )
                                              .format('mm:ss')
                                        : '00:00'}
                                </span>
                                <span className="inline-block text-[#FFFFFF80]">
                                    /
                                </span>
                            </>
                        )}
                        <span className="inline-block text-[#FFFFFF80]">
                            {moment
                                .utc((totalDuration as number) * 1000)
                                .format('mm:ss')}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

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
                {isLoading && (
                    <div className="flex flex-col gap-2 p-2">
                        <Skeleton className="h-[30px] !m-0" />
                        <Skeleton className="h-[30px] !m-0" />
                        <Skeleton className="h-[30px] !m-0" />
                    </div>
                )}
                {!isLoading &&
                    data?.subchapters?.map((value) =>
                        value.type === 'video' ? (
                            <VideoItem value={value} chapter_id={chapter_id} />
                        ) : (
                            <ExerciseItem value={value} />
                        )
                    )}
            </div>
        </div>
    );
};

export default Collapse;
