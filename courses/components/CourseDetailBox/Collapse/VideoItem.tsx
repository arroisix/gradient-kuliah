import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Link from 'next/link';
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

    const { duration, last_duration: lastDuration } = value;

    const convertToSeconds = (timeString?: string | null): number => {
        if (!timeString) return 0;
        const duration = timeString.split(':').map(Number);
        const [seconds, minutes, hours] = duration.reverse();
        return (hours ?? 0) * 60 * 60 + minutes * 60 + seconds;
    };

    const totalDuration = convertToSeconds(duration);
    const totalLastDuration = convertToSeconds(lastDuration);

    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
            2,
            '0'
        )}`;
    };

    const lastDurationDisplay = formatTime(totalLastDuration);
    const durationDisplay = formatTime(totalDuration);

    const track = (): void => {
        if (is_subscribed || value.is_free) {
            tracker?.genericTrack('Click Video Item', {
                'Course Slug': id,
                'Video Title': value.subchapter_name,
                'Chapter ID': chapter_id
            });
        } else {
            tracker?.genericTrack('Click Locked Video Item', {
                'Course Slug': id,
                'Video Title': value.subchapter_name,
                'Chapter ID': chapter_id
            });
        }
    };

    return (
        <Link
            key={value.id}
            href={`/kelas/${id}/${value?.subchapter_slug}`}
            className="flex justify-between px-3 py-[10px] cursor-pointer hover:bg-[#272727]"
            onClick={track}>
            <div
                className={cn(
                    'flex items-center gap-[10px]',
                    sub === value.id ? 'w-[65%]' : 'w-[80%]'
                )}>
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
                {duration && (
                    <>
                        {sub === value.id && (
                            <>
                                <span className="inline-block">
                                    {lastDurationDisplay}
                                </span>
                                <span className="inline-block text-[#FFFFFF80]">
                                    /
                                </span>
                            </>
                        )}
                        <span className="inline-block text-[#FFFFFF80]">
                            {durationDisplay}
                        </span>
                    </>
                )}
            </div>
        </Link>
    );
};

export default VideoItem;
