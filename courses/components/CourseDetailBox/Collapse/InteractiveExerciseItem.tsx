import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { HiLockClosed, HiPencil } from 'react-icons/hi';
import { useTracker } from 'tracker/tracker';

const InteractiveExerciseItem = ({
    value,
    chapter_id
}: {
    value: SubChapter;
    chapter_id: string;
}): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();
    const { id } = router.query;
    const { is_subscribed } = useCourseSubscription();

    const track = (): void => {
        if (is_subscribed || value.is_free) {
            tracker?.genericTrack('Click Exercise Item', {
                'Course Slug': id,
                'Exercise Title': value.title,
                'Chapter ID': chapter_id
            });
        } else {
            tracker?.genericTrack('Click Locked Exercise Item', {
                'Course Slug': id,
                'Exercise Title': value.title,
                'Chapter ID': chapter_id
            });
        }
    };

    return (
        <Link
            key={value.id}
            href={`/latihan/${value?.exercise_slug}`}
            className="flex justify-between px-3 py-[10px] cursor-pointer hover:bg-[#272727]"
            onClick={track}>
            <div className="flex items-center gap-[10px] w-[80%]">
                <div className="w-[18px] h-[18px]">
                    {is_subscribed || value.is_free ? (
                        <HiPencil size={18} />
                    ) : (
                        <HiLockClosed className="text-neutral-600" />
                    )}
                </div>
                <h4
                    className={cn(
                        'overflow-hidden text-xs font-body whitespace-nowrap text-ellipsis',
                        !is_subscribed && !value.is_free && 'text-neutral-600'
                    )}>
                    {value.title}
                </h4>
            </div>
        </Link>
    );
};

export default InteractiveExerciseItem;
