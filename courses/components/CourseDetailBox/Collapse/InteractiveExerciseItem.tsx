import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { cn } from 'commons/utils';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { HiLockClosed, HiPencil } from 'react-icons/hi';
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io';
import { useSelector } from 'react-redux';
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
    const isAuthenticated = useSelector(getIsAuthenticated);

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

    const decideURLLink = (): string => {
        if (isAuthenticated) {
            if (is_subscribed || value.is_free) {
                return `/latihan/${value?.exercise_slug}`;
            } else {
                return '/langganan';
            }
        } else {
            return '/masuk';
        }
    };

    const renderIcon = (): JSX.Element => {
        if (is_subscribed || value.is_free) {
            if (value.status == 'COMPLETED') {
                if (
                    value.latest_score &&
                    value.minimum_score &&
                    value?.latest_score >= value?.minimum_score
                ) {
                    return (
                        <IoIosCheckmarkCircle
                            size={18}
                            className="text-[#02EC60]"
                        />
                    );
                } else {
                    return (
                        <button
                            data-tip={`Score yang kamu dapatkan di percobaan terakhir belum mencapai score minimum yang perlu dicapai, yaitu ${value.minimum_score}`}
                            className="tooltip tooltip-right">
                            <IoIosCloseCircle
                                size={18}
                                className="text-red-500 mb-[6px]"
                            />
                        </button>
                    );
                }
            } else if (value.status == 'IN_PROGRESS') {
                return (
                    <div className="w-[18px] h-[18px] relative flex justify-center items-center">
                        <div
                            className="radial-progress"
                            style={
                                {
                                    '--value': 70,
                                    '--size': '15px',
                                    '--thickness': '2px'
                                } as React.CSSProperties
                            }></div>
                        <div
                            className="absolute radial-progress text-accent-purple/50"
                            style={
                                {
                                    '--value': '100',
                                    '--size': '15px',
                                    '--thickness': '2px'
                                } as React.CSSProperties
                            }></div>
                    </div>
                );
            } else {
                return <HiPencil size={18} />;
            }
        } else {
            return <HiLockClosed className="text-neutral-600" />;
        }
    };

    return (
        <Link
            key={value.id}
            href={decideURLLink()}
            className="flex justify-between px-3 py-[10px] cursor-pointer hover:bg-[#272727]"
            onClick={track}>
            <div className="flex items-center gap-[10px] w-[80%]">
                <div className="w-[18px] h-[18px]">{renderIcon()}</div>
                <h4
                    className={cn(
                        'overflow-hidden text-xs font-body whitespace-nowrap text-ellipsis',
                        !is_subscribed && !value.is_free && 'text-neutral-600'
                    )}>
                    {value.title}
                </h4>
            </div>
            <div className="flex gap-1 text-xs font-body">
                {value.status == 'COMPLETED' && value.latest_score && (
                    <span>
                        {parseFloat(
                            value?.latest_score as unknown as string
                        ).toFixed(2)}
                        /100
                    </span>
                )}
            </div>
        </Link>
    );
};

export default InteractiveExerciseItem;
