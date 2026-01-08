import { useAuth } from 'authentication/contexts/AuthProvider';
import Button from 'commons/components/elements/Button';
import Modal from 'commons/components/modules/Modal';
import { CourseSubchapterSearchProvider } from 'courses/hooks/useSearchSubchapter';
import { useGetLearningProgressQuery } from 'courses/redux/api/learningExperienceApi';
import { useGetSubchapterDetailV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicSubchapterDetailV2Query } from 'courses/redux/api/publicCourseV2Api';
import { ListIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SearchMateri } from './SearchMateri';
import { MateriDetailContent } from './MateriDetailContent';

interface MateriDetailSheetProps {
    course: CourseDetail;
    next_subchapter_slug: string;
}

function MateriDetailSheet({
    course,
    next_subchapter_slug
}: MateriDetailSheetProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const privateSubchapterDetails = useGetSubchapterDetailV2Query(
        { course_slug: slug_subtest, subchapter_slug: next_subchapter_slug },
        { skip: !slug_subtest || !next_subchapter_slug || !isAuthenticated }
    );

    const publicSubchapterDetails = useGetPublicSubchapterDetailV2Query(
        { course_slug: slug_subtest, subchapter_slug: next_subchapter_slug },
        { skip: !slug_subtest || !next_subchapter_slug || isAuthenticated }
    );

    const { data: subchapter, isLoading } = isAuthenticated
        ? privateSubchapterDetails
        : publicSubchapterDetails;

    const { data: learningProgress, isLoading: isLoadingLearning } =
        useGetLearningProgressQuery(slug_subtest, {
            skip: !slug_subtest || !isAuthenticated
        });

    const completedMateriCount =
        learningProgress?.completion_percentage?.total_finished_video;
    const totalMateriCount =
        learningProgress?.completion_percentage?.total_video_count;

    const progress = Math.min(
        Math.max((completedMateriCount / totalMateriCount) * 100, 0),
        100
    );

    return (
        <div className="bg-[#101010] rounded-tl-2xl rounded-tr-2xl fixed bottom-0 left-0 right-0 flex justify-between items-center gap-4 p-4">
            <div className="space-y-1">
                <span className="text-[#999999] text-xs">
                    Materi Selanjutnya
                </span>

                {!isLoading ? (
                    <h3 className="text-white font-semibold text-sm line-clamp-1">
                        {subchapter?.subchapter_name}
                    </h3>
                ) : (
                    <div className="animate-pulse bg-[#333333] h-3 w-48 rounded-md"></div>
                )}
            </div>

            <div className="flex justify-between items-center gap-2">
                <Button
                    disabled={isLoading}
                    onClick={() => setIsOpen(true)}
                    variant="neutral"
                    className="flex items-center gap-1.5 text-sm !p-2">
                    <ListIcon className="fill-white w-4 h-4 group-disabled:fill-neutral-300/30" />
                </Button>

                <Link
                    href={`/utbk/materi/${slug_subtest}/${subchapter?.chapter_id}/${subchapter?.subchapter_slug}`} // TODO: change chapter_id with chapter_name
                    className={`${
                        isLoading
                            ? 'pointer-events-none bg-neutral-700/80 text-neutral-300/30'
                            : 'bg-[#333333] text-white'
                    } rounded-full text-sm leading-tight font-semibold !p-2 !px-4`}>
                    Lanjut
                </Link>
            </div>

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
                                            style={{ width: `${progress}%` }}
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
                                            {(isNaN(progress)
                                                ? 0
                                                : progress
                                            ).toFixed(0)}
                                            %
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
                    </>
                </Modal>
            ) : (
                <></>
            )}
        </div>
    );
}

export default MateriDetailSheet;
