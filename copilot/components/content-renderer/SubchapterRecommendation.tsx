import { cn, formatDuration } from 'commons/utils';
import { BadgeQuestionMarkIcon, BookOpenIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';

interface SubchapterRecommendationProps {
    type: 'video' | 'article' | 'quiz';
    course_slug: string;
    chapter_slug: string;
    subchapter_slug: string;
    subchapter_name: string;
    duration?: string;
}

function SubchapterRecommendation({
    type,
    course_slug,
    chapter_slug,
    subchapter_slug,
    subchapter_name,
    duration
}: SubchapterRecommendationProps): JSX.Element {
    return (
        <div
            className={cn(
                'bg-[#222222] p-3 rounded-xl flex flex-col w-full',
                'md:flex-row md:justify-between md:items-center md:max-w-[527px]'
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
                        {subchapter_name}
                    </h3>

                    {type === 'video' ? (
                        <span className="text-[#999999] text-sm leading-[160%]">
                            {formatDuration(duration)}
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
                    'bg-[#5F2BCE] text-white font-semibold text-sm leading-tight py-2 px-4 w-full rounded-full text-center',
                    'md:w-fit'
                )}>
                {type === 'video'
                    ? 'Tonton Video'
                    : type === 'article'
                    ? 'Baca Artikel'
                    : 'Mulai Quiz'}
            </Link>
        </div>
    );
}

export { SubchapterRecommendation };
