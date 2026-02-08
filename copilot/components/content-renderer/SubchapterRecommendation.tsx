import { cn, formatDuration } from 'commons/utils';
import { ContentRecommendationType } from 'copilot/types/copilot';
import { BadgeQuestionMarkIcon, BookOpenIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';

interface SubchapterRecommendationProps {
    type: ContentRecommendationType;
    title: string;
    course_slug: string;
    chapter_slug: string;
    subchapter_slug: string;
    video_duration?: string;
}

function SubchapterRecommendation({
    type,
    title,
    course_slug,
    chapter_slug,
    subchapter_slug,
    video_duration
}: SubchapterRecommendationProps): JSX.Element {
    return (
        <div
            className={cn(
                'carousel-item bg-[#222222] rounded-xl w-full',
                'md:max-w-[527px]'
            )}>
            <div
                className={cn(
                    'w-full p-3',
                    'md:flex md:flex-row md:justify-between md:items-center'
                )}>
                <div
                    className={cn(
                        'flex flex-col gap-2 mb-4',
                        'md:flex-row md:items-center md:gap-4 md:mb-0'
                    )}>
                    {type === 'video' ? (
                        <VideoIcon className="text-white shrink-0 w-4 h-4" />
                    ) : type === 'article' ? (
                        <BookOpenIcon className="text-white shrink-0 w-4 h-4" />
                    ) : (
                        <BadgeQuestionMarkIcon className="text-white shrink-0 w-4 h-4" />
                    )}

                    <div className="flex flex-col gap-1">
                        <h3 className="text-white text-sm leading-[160%]">
                            {title}
                        </h3>

                        {type === 'video' ? (
                            <span className="text-[#999999] text-sm leading-[160%]">
                                {formatDuration(video_duration)}
                            </span>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>

                <Link
                    href={`/utbk/materi/${course_slug}/${chapter_slug}/${subchapter_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        'bg-[#5F2BCE] text-white font-semibold text-sm leading-tight py-2 px-4 block w-full rounded-full text-center',
                        'md:w-fit'
                    )}>
                    {type === 'video'
                        ? 'Tonton Video'
                        : type === 'article'
                        ? 'Baca Artikel'
                        : 'Mulai Quiz'}
                </Link>
            </div>
        </div>
    );
}

export { SubchapterRecommendation };
