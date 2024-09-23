import { cn, formatDuration } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import moment from 'moment';
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
    const { id, slug } = router.query;
    const { is_subscribed } = useCourseSubscription();

    const { duration, last_duration: lastDuration } = value;

    const lastDurationDisplay = formatDuration(lastDuration);
    const durationDisplay = formatDuration(duration);

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
                    slug === value.subchapter_slug ? 'w-[65%]' : 'w-[80%]'
                )}>
                <div className="w-[18px] h-[18px]">
                    {value.is_finished ? (
                        <IoIosCheckmarkCircle
                            size={18}
                            className="text-[#02EC60]"
                        />
                    ) : slug === value.subchapter_slug ? (
                        <div className="w-[18px] h-[18px] relative flex justify-center items-center">
                            <div
                                className="radial-progress"
                                style={
                                    {
                                        '--value': Math.floor(
                                            (moment
                                                .duration(lastDuration)
                                                .asSeconds() /
                                                moment
                                                    .duration(duration)
                                                    .asSeconds()) *
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
                <h4
                    className={cn(
                        'overflow-hidden text-xs font-body whitespace-nowrap text-ellipsis',
                        !is_subscribed && !value.is_free && 'text-neutral-600'
                    )}>
                    {value.subchapter_name}
                </h4>
            </div>
            <div className="flex gap-1 text-xs font-body">
                {duration && (
                    <>
                        {slug === value.subchapter_slug && (
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
