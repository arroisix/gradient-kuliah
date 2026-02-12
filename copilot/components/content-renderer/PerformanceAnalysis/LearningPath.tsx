import { useAuth } from 'authentication/contexts/AuthProvider';
import { cn, formatDuration } from 'commons/utils';
import { LearningPathIcon } from 'copilot/assets/LearningPathIcon';
import { useGetProblemsetLearningPathQuery } from 'copilot/redux/api/copilotApi';
import {
    GetProblemsetLearningPath,
    PerformanceAnalysis
} from 'copilot/types/copilot';
import {
    BadgeQuestionMarkIcon,
    BookOpenIcon,
    ChevronLeftIcon,
    VideoIcon
} from 'lucide-react';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { FaRegDotCircle } from 'react-icons/fa';

// generate text color based on subtest score
function generateHexTextColor(score: number): string {
    return score < 300
        ? 'text-[#DB4A3B]'
        : score >= 300 && score < 550
        ? 'text-[#F2C04C]'
        : 'text-[#03AC5C]';
}

interface LearningPathProps {
    problemset_result: PerformanceAnalysis['problemset_results'][number];
    setOpenedLearningPath: Dispatch<
        SetStateAction<PerformanceAnalysis['problemset_results'][number] | null>
    >;
}

function LearningPath({
    problemset_result,
    setOpenedLearningPath
}: LearningPathProps): JSX.Element {
    const { data, isLoading } = useGetProblemsetLearningPathQuery({
        problemset_progress_id: problemset_result.problemset_progress_id
    });

    if (isLoading) {
        return (
            <div className="animate-fade">
                <div
                    className={cn(
                        'animate-pulse bg-[#333333] rounded-2xl overflow-hidden w-full max-w-[303px] mx-auto pb-8 h-64',
                        'md:max-w-[680px]'
                    )}></div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'bg-[#191920] animate-fade rounded-2xl overflow-hidden w-full max-w-[303px] mx-auto h-full max-h-[1024px] flex flex-col',
                'md:max-w-[680px]'
            )}>
            <div
                className={cn(
                    'bg-[#20222E] p-4 flex justify-between items-center gap-4',
                    'md:px-6'
                )}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setOpenedLearningPath(null)}
                        type="button"
                        className={cn(
                            'bg-white/25 w-6 h-6 rounded-full grid place-items-center',
                            'md:w-8 md:h-8'
                        )}>
                        <ChevronLeftIcon className="text-white w-4 h-4" />
                    </button>

                    <div className="flex flex-col items-start">
                        <span className="text-[#999999] text-sm leading-[160%]">
                            Learning Path
                        </span>
                        <h3
                            className={cn(
                                'text-white font-semibold leading-tight text-sm',
                                'md:leading-[140%] md:text-base'
                            )}>
                            {problemset_result.problemset_title}
                        </h3>
                    </div>
                </div>

                <h3
                    className={cn(
                        'font-semibold text-xl leading-[140%]',
                        generateHexTextColor(problemset_result.score)
                    )}>
                    {problemset_result.score}
                </h3>
            </div>

            <div
                className={cn(
                    'flex-grow pt-6 pb-8 mx-3 space-y-6 overflow-scroll scrollbar-none',
                    'md:mx-6 md:pr-4'
                )}>
                {Array.isArray(data?.chapters) && data?.chapters.length > 0 ? (
                    data?.chapters.map((chapter, index, chapters) => (
                        <ChapterLearningPath
                            key={chapter.slug}
                            chapter={chapter}
                            isLastChapter={index === chapters.length - 1}
                        />
                    ))
                ) : (
                    <div className="flex flex-col justify-center items-center gap-2 w-full max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-full bg-[#333333] grid place-items-center">
                            <LearningPathIcon className="fill-white w-8 h-8" />
                        </div>

                        <p className="text-white leading-[160%]">
                            Belum ada learning path untuk ditampilkan.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface ChapterLearningPathProps {
    chapter: GetProblemsetLearningPath['chapters'][number];
    isLastChapter: boolean;
}

function ChapterLearningPath({
    chapter,
    isLastChapter
}: ChapterLearningPathProps): JSX.Element {
    const { profile } = useAuth();

    return (
        <div>
            <div className={cn('flex items-center mb-3', 'md:mb-4')}>
                {/* chapter dot indicator */}
                <div className="relative shrink-0 z-10 w-5 flex justify-center items-center">
                    <div className="bg-[#666666] w-2.5 h-2.5 rounded-full" />
                </div>

                <h4
                    className={cn(
                        'text-white font-semibold leading-[140%] ml-3',
                        'md:ml-4'
                    )}>
                    {chapter.chapter_title}
                </h4>
            </div>

            <div className="relative">
                {/* timeline indicator */}
                <div
                    className={cn(
                        'bg-[#666666] absolute -top-7 left-[9px] w-0.5',
                        'md:-top-6',
                        isLastChapter ? 'bottom-0' : '-bottom-12'
                    )}
                />

                <div className={cn('space-y-3', 'md:space-y-4')}>
                    {chapter.subchapters.map((subchapter) => (
                        <div key={subchapter.id} className="flex items-center">
                            {/* subchapter dot indicator */}
                            <div className="relative z-10 flex justify-center w-5">
                                <FaRegDotCircle className="bg-[#191920] rounded-full text-[#5F2BCE] w-5 h-5" />
                            </div>

                            <div
                                className={cn(
                                    'bg-[#222222] rounded-xl py-3 px-4 ml-3 w-full flex flex-col gap-4',
                                    'md:ml-4 md:flex-row md:justify-between md:items-center'
                                )}>
                                <div className="flex flex-row items-center gap-4">
                                    {subchapter.type === 'video' ? (
                                        <VideoIcon className="text-white shrink-0 w-4 h-4" />
                                    ) : subchapter.type === 'article' ? (
                                        <BookOpenIcon className="text-white shrink-0 w-4 h-4" />
                                    ) : (
                                        <BadgeQuestionMarkIcon className="text-white shrink-0 w-4 h-4" />
                                    )}

                                    <div className="flex flex-col">
                                        <h5 className="text-white text-sm leading-[160%]">
                                            {subchapter.title}
                                        </h5>

                                        {subchapter.type === 'video' ? (
                                            <span className="text-[#999999] text-sm leading-[160%]">
                                                {formatDuration(
                                                    subchapter.video_duration
                                                )}
                                            </span>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    href={
                                        profile?.current_role ===
                                        'COLLEGE_STUDENT'
                                            ? `/kelas/${subchapter.slug}`
                                            : `/utbk/materi/${subchapter.course_slug}/${subchapter.chapter_slug}/${subchapter.slug}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        'text-white text-center font-semibold text-sm leading-tight rounded-full py-2 px-4 transition-colors border border-transparent w-full',
                                        'md:w-fit',
                                        subchapter.is_finished
                                            ? 'bg-[#2C2C2C] hover:bg-[#2C2C2C]/[75%] border-[#999999]'
                                            : 'bg-[#333333] hover:bg-[#333333]/[75%]'
                                    )}>
                                    {subchapter.is_finished
                                        ? 'Pelajari Lagi'
                                        : 'Lihat'}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export { LearningPath };
