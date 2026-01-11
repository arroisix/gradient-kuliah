import { useAuth } from 'authentication/contexts/AuthProvider';
import Button from 'commons/components/elements/Button';
import Modal from 'commons/components/modules/Modal';
import { CourseSubchapterSearchProvider } from 'courses/hooks/useSearchSubchapter';
import { useGetLearningProgressQuery } from 'courses/redux/api/learningExperienceApi';
import { ListIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { SearchMateri } from './SearchMateri';
import { MateriDetailContent } from './MateriDetailContent';
import VideoTranscript from './VideoTranscript';

interface MateriDetailSheetProps {
    course: CourseDetail;
    next_chapter_slug: string;
    next_subchapter_slug: string;
    next_subchapter_name: string;
    transcript?: Transcript[];
    isTranscriptOpen: boolean;
    setIsTranscriptOpen: Dispatch<SetStateAction<boolean>>;
}

function MateriDetailSheet({
    course,
    next_chapter_slug,
    next_subchapter_slug,
    next_subchapter_name,
    transcript,
    isTranscriptOpen,
    setIsTranscriptOpen
}: MateriDetailSheetProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

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

    return (
        <div className="bg-[#101010] rounded-tl-2xl rounded-tr-2xl fixed bottom-0 left-0 right-0 flex justify-between items-center gap-4 p-4">
            {next_subchapter_name ? (
                <div className="space-y-1">
                    <span className="text-[#999999] text-xs">
                        Materi Selanjutnya
                    </span>

                    <h3 className="text-white font-semibold text-sm line-clamp-1">
                        {next_subchapter_name}
                    </h3>
                </div>
            ) : (
                <></>
            )}

            <div
                className={`${
                    next_subchapter_slug ? '' : 'w-full'
                } flex justify-between items-center gap-2`}>
                <Button
                    onClick={() => setIsOpen(true)}
                    variant="neutral"
                    className="flex items-center gap-1.5 text-sm !p-2">
                    <ListIcon className="fill-white w-4 h-4 group-disabled:fill-neutral-300/30" />
                </Button>

                <Link
                    href={
                        next_subchapter_slug
                            ? `/utbk/materi/${slug_subtest}/${next_chapter_slug}/${next_subchapter_slug}`
                            : '/utbk/materi'
                    }
                    className={`${
                        next_subchapter_slug ? '' : 'w-full'
                    } bg-[#333333] text-white text-center rounded-full text-sm leading-tight font-semibold !p-2 !px-4`}>
                    {next_subchapter_slug ? 'Lanjut' : 'Selesai'}
                </Link>
            </div>

            {isTranscriptOpen ? (
                <Modal
                    isOpen={isTranscriptOpen}
                    setOpen={(value) => setIsTranscriptOpen(value)}
                    permanent={true}
                    variant="dark"
                    containerClassName="modal modal-open modal-bottom lg:modal-middle min-h-[100px]"
                    className="bg-[#181818] h-screen p-0">
                    <VideoTranscript
                        transcript={transcript}
                        setIsOpen={setIsTranscriptOpen}
                    />
                </Modal>
            ) : (
                <></>
            )}

            {isOpen ? (
                <Modal
                    isOpen={isOpen}
                    setOpen={(value) => setIsOpen(value)}
                    permanent={true}
                    variant="dark"
                    containerClassName="modal modal-open modal-bottom lg:modal-middle min-h-[100px]"
                    className="bg-[#181818] h-screen p-0">
                    <>
                        <div className="bg-[#101010] p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-white font-semibold">
                                    Daftar Materi
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}>
                                    <XIcon className="text-[#4D5165] w-6 h-6" />
                                </button>
                            </div>

                            <h3 className="text-white font-semibold">
                                {course?.course_name}
                            </h3>

                            {isAuthenticated ? (
                                !isLoadingLearning ? (
                                    <div className="bg-[#4B4E5F] rounded-full overflow-hidden w-full h-2 my-4">
                                        <div
                                            className="bg-[#B6A6F3] rounded-full transition-all duration-500 ease-out h-full"
                                            style={{
                                                width: `${percentageProgress}%`
                                            }}
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
                                            {completedMateriCount} dari{' '}
                                            {totalMateriCount} Materi Selesai
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
                                <MateriDetailContent
                                    setIsModalSheetOpen={setIsOpen}
                                />
                            </div>
                        </CourseSubchapterSearchProvider>
                    </>
                </Modal>
            ) : (
                <></>
            )}
        </div>
    );
}

export default MateriDetailSheet;
