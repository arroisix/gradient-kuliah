import { useAuth } from 'authentication/contexts/AuthProvider';
import { CourseSubchapterSearchProvider } from 'courses/hooks/useSearchSubchapter';
import { useGetLearningProgressQuery } from 'courses/redux/api/learningExperienceApi';
import { useRouter } from 'next/router';
import { SearchMateri } from './SearchMateri';
import { MateriDetailContent } from './MateriDetailContent';
import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction } from 'react';

const VideoTranscript = dynamic(() => import('./VideoTranscript'));

interface MateriDetailBoxProps {
    course: CourseDetail | undefined;
    transcript?: Transcript[];
    isTranscriptOpen: boolean;
    setIsTranscriptOpen: Dispatch<SetStateAction<boolean>>;
}

function MateriDetailBox({
    course,
    isTranscriptOpen,
    transcript,
    setIsTranscriptOpen
}: MateriDetailBoxProps): JSX.Element {
    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const { isAuthenticated } = useAuth();

    const { data: learningProgress, isLoading: isLoadingLearning } =
        useGetLearningProgressQuery(slug_subtest, {
            skip: !slug_subtest || !isAuthenticated
        });

    const completedMateriCount =
        learningProgress?.completion_percentage?.total_finished_video;

    const totalMateriCount =
        learningProgress?.completion_percentage?.total_video_count;

    const percentageProgress =
        learningProgress?.completion_percentage?.percentage_progress;

    if (isTranscriptOpen) {
        return (
            <div className="relative z-10 col-span-3 bg-[#181818] w-full h-full rounded-2xl overflow-hidden">
                <VideoTranscript
                    transcript={transcript}
                    setIsOpen={setIsTranscriptOpen}
                />
            </div>
        );
    }

    return (
        <div className="relative z-10 col-span-3 bg-[#181818] w-full rounded-2xl overflow-hidden">
            <div className="bg-[#101010] p-6">
                <h3 className="text-white font-semibold">
                    {course?.course_name}
                </h3>

                {isAuthenticated ? (
                    !isLoadingLearning ? (
                        <div className="bg-[#4B4E5F] rounded-full overflow-hidden w-full h-2 my-4">
                            <div
                                className="bg-[#B6A6F3] rounded-full transition-all duration-500 ease-out h-full"
                                style={{ width: `${percentageProgress}%` }}
                                role="progressbar"
                                aria-valuenow={completedMateriCount}
                                aria-valuemin={0}
                                aria-valuemax={totalMateriCount}
                            />
                        </div>
                    ) : (
                        <div className="animate-pulse h-2 w-full bg-[#333333] rounded-full my-4"></div>
                    )
                ) : (
                    <></>
                )}

                {isAuthenticated ? (
                    !isLoadingLearning ? (
                        <div className="flex justify-between items-center">
                            <span className="text-[#999999] text-sm">
                                {completedMateriCount} dari {totalMateriCount}{' '}
                                Materi Selesai
                            </span>
                            <span className="text-white font-semibold">
                                {percentageProgress?.toFixed(0)}%
                            </span>
                        </div>
                    ) : (
                        <div className="animate-pulse flex justify-between items-center gap-8">
                            <div className="bg-[#333333] h-3 w-64 rounded-full"></div>
                            <div className="bg-[#333333] h-3 w-32 rounded-full"></div>
                        </div>
                    )
                ) : (
                    <></>
                )}
            </div>

            <CourseSubchapterSearchProvider>
                <div className="mx-6 mb-6">
                    <SearchMateri />
                    <MateriDetailContent />
                </div>
            </CourseSubchapterSearchProvider>
        </div>
    );
}

export default MateriDetailBox;
