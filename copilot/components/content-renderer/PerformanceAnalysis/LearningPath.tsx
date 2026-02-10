import { useAuth } from 'authentication/contexts/AuthProvider';
import { cn, formatDuration } from 'commons/utils';
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
            <div className="animate-pulse bg-[#333333] rounded-2xl overflow-hidden w-full max-w-[680px] pb-8 h-64"></div>
        );
    }

    return (
        <div className="bg-[#191920] rounded-2xl overflow-hidden w-full max-w-[680px] pb-8">
            <div className="bg-[#20222E] px-6 py-4 flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setOpenedLearningPath(null)}
                        type="button"
                        className="bg-white/25 w-8 h-8 rounded-full grid place-items-center">
                        <ChevronLeftIcon className="text-white w-4 h-4" />
                    </button>

                    <div className="flex flex-col items-start gap-1">
                        <span className="text-[#999999] text-sm leading-[160%]">
                            Learning Path
                        </span>
                        <h3 className="text-white font-semibold leading-[140%]">
                            {problemset_result.problemset_title}
                        </h3>
                    </div>
                </div>

                <h3 className="text-[#03AC5C] font-semibold text-xl leading-[140%]">
                    {problemset_result.score}
                </h3>
            </div>

            <div className="mt-6 mx-6 pr-4 space-y-6">
                {data?.chapters.map((chapter, index) => (
                    <ChapterLearningPath
                        key={chapter.slug}
                        chapter={chapter}
                        isLastChapter={index === data.chapters.length - 1}
                    />
                ))}
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
            <div className="flex items-center mb-4">
                {/* chapter dot indicator */}
                <div className="relative z-10 w-5 flex justify-center items-center">
                    <div className="bg-[#666666] w-2.5 h-2.5 rounded-full" />
                </div>

                <h4 className="text-white font-semibold leading-[140%] ml-8">
                    {chapter.chapter_title}
                </h4>
            </div>

            <div className="relative">
                {/* timeline indicator */}
                <div
                    className={cn(
                        'bg-[#666666] absolute -top-6 left-[9px] w-0.5',
                        isLastChapter ? 'bottom-0' : '-bottom-8'
                    )}
                />

                <div className="space-y-4">
                    {chapter.subchapters.map((subchapter) => (
                        <div key={subchapter.id} className="flex items-center">
                            {/* subchapter dot indicator */}
                            <div className="relative z-10 flex justify-center w-5">
                                <FaRegDotCircle className="bg-[#191920] rounded-full text-[#5F2BCE] w-5 h-5" />
                            </div>

                            <div className="bg-[#222222] rounded-xl py-3 px-4 ml-8 w-full flex justify-between items-center">
                                <div className="flex flex-row items-center gap-4">
                                    {subchapter.type === 'video' ? (
                                        <VideoIcon className="text-white shrink-0 w-4 h-4" />
                                    ) : subchapter.type === 'article' ? (
                                        <BookOpenIcon className="text-white shrink-0 w-4 h-4" />
                                    ) : (
                                        <BadgeQuestionMarkIcon className="text-white shrink-0 w-4 h-4" />
                                    )}

                                    <div className="flex flex-col gap-1">
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
                                        'text-white font-semibold text-sm leading-tight rounded-full py-2 px-4 transition-colors border border-transparent',
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
