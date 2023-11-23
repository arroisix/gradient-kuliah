import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useRouter } from 'next/router';
import React from 'react';
import { HiLockClosed, HiPlay } from 'react-icons/hi';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { useTracker } from 'tracker/tracker';

const VideoItem = ({
    value,
    chapter_id
}: {
    value: SubChapter;
    chapter_id: string;
}): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { id, sub } = router.query;
    const { is_subscribed } = useCourseSubscription();

    const totalDuration = value?.duration
        ?.split(':')
        ?.reverse()
        ?.reduce((prev, curr, i) => +prev + +curr * +Math.pow(60, i), 0);

    const totalLastDuration = value?.last_duration
        ?.split(':')
        ?.reverse()
        ?.reduce((prev, curr, i) => +prev + +curr * +Math.pow(60, i), 0);

    const totalDurationSecond = (totalDuration as number) % 60;
    const totalDurationMinute = Math.floor((totalDuration as number) / 60);
    const lastDurationSecond = (totalLastDuration as number) % 60;
    const lastDurationMinute = Math.floor((totalLastDuration as number) / 60);

    return (
        <div
            key={value.id}
            className="flex justify-between px-3 py-[10px] cursor-pointer hover:bg-[#272727]"
            onClick={() => {
                tracker?.genericTrack('Click Video Item', {
                    'Course Slug': id,
                    'Video Title': value.subchapter_name,
                    'Chapter ID': chapter_id
                });
                router.push(
                    `/kelas/${id}/belajar/video/${chapter_id}/${value.id}`
                );
            }}
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
                                className="absolute radial-progress"
                                style={
                                    {
                                        color: '#FFFFFF1A',
                                        '--value': '100',
                                        '--size': '15px',
                                        '--thickness': '2px'
                                    } as React.CSSProperties
                                }></div>
                        </div>
                    ) : is_subscribed || value.is_free ? (
                        <HiPlay size={18} />
                    ) : (
                        <HiLockClosed className="text-neutral-600" />
                    )}
                </div>
                <span
                    className={cn(
                        'inline-block overflow-hidden text-xs font-body whitespace-nowrap text-ellipsis',
                        !is_subscribed && !value.is_free && 'text-neutral-600'
                    )}>
                    {value.subchapter_name}
                </span>
            </div>
            <div className="flex gap-1 text-xs font-body">
                {value.duration && (
                    <>
                        {sub === value.id && (
                            <>
                                <span className="inline-block">
                                    {value.last_duration
                                        ? `${`${lastDurationMinute}`.padStart(
                                              2,
                                              '0'
                                          )}:${`${lastDurationSecond}`.padStart(
                                              2,
                                              '0'
                                          )}`
                                        : '00:00'}
                                </span>
                                <span className="inline-block text-[#FFFFFF80]">
                                    /
                                </span>
                            </>
                        )}
                        <span className="inline-block text-[#FFFFFF80]">
                            {value.duration
                                ? `${`${totalDurationMinute}`.padStart(
                                      2,
                                      '0'
                                  )}:${`${totalDurationSecond}`.padStart(
                                      2,
                                      '0'
                                  )}`
                                : '00:00'}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default VideoItem;
