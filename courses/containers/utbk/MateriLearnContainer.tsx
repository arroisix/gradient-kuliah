import Button from 'commons/components/elements/Button';
import { FaChevronLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useGetSubchapterDetailV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicSubchapterDetailV2Query } from 'courses/redux/api/publicCourseV2Api';
import { useGetCourseDetailQuery } from 'courses/redux/api/courseApi';
import { ShareButton } from 'courses/components/utbk/ShareButton';
import { useMemo, useState } from 'react';
import CopilotIconFill from 'copilot/assets/CopilotIconFill';
import { TranscriptIcon } from 'commons/components/elements/Icons/TranscriptIcon';
import CopilotModal from 'copilot/components/CopilotModal';
import { LecturerProfile } from 'courses/components/utbk/LecturerProfile';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { MateriLearnNavigation } from 'courses/components/utbk/MateriLearnNavigation';
import dynamic from 'next/dynamic';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { BelajarPageProps } from 'pages/utbk/materi/[slug_subtest]/[slug_chapter]/[slug_subchapter]';

const RatingButton = dynamic(
    () => import('courses/components/utbk/RatingButton')
);

const MateriDetailBox = dynamic(
    () => import('courses/components/utbk/MateriDetailBox')
);

const MateriDetailSheet = dynamic(
    () => import('courses/components/utbk/MateriDetailSheet')
);

const VideoPlayerContainer = dynamic(
    () => import('courses/components/VideoPlayerContainer')
);

const MateriArticleContainer = dynamic(
    () => import('courses/components/MateriArticleContainer')
);

function MateriLearnContainer({
    subchapter: ssrSubchapter,
    course: ssrCourse,
    book,
    content
}: BelajarPageProps): JSX.Element {
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
    const [isCopilotModalOpen, setIsCopilotModalOpen] =
        useState<boolean>(false);

    const router = useRouter();
    const { slug_subtest, slug_subchapter } = router.query as {
        slug_subtest: string;
        slug_subchapter: string;
    };

    const { isAuthenticated } = useAuth();
    const { isDesktopBreakpoints } = useWindowBreakpoints();

    const privateSubchapterDetails = useGetSubchapterDetailV2Query(
        { course_slug: slug_subtest, subchapter_slug: slug_subchapter },
        { skip: !slug_subtest || !slug_subchapter || !isAuthenticated }
    );

    const publicSubchapterDetails = useGetPublicSubchapterDetailV2Query(
        { course_slug: slug_subtest, subchapter_slug: slug_subchapter },
        { skip: !slug_subtest || !slug_subchapter || isAuthenticated }
    );

    const { data: csrSubchapter, isLoading } = isAuthenticated
        ? privateSubchapterDetails
        : publicSubchapterDetails;

    const { data: csrCourse } = useGetCourseDetailQuery(
        { slug: slug_subtest },
        { skip: !slug_subtest }
    );

    const course = csrCourse?.course_detail ?? ssrCourse;
    const subchapter = csrSubchapter ?? ssrSubchapter;

    const currentVideoContext =
        subchapter?.video && subchapter?.subchapter_name
            ? {
                  id: subchapter.video.id,
                  title: course ? course.course_name : '',
                  subtitle: subchapter.chapter_name,
                  header: subchapter.subchapter_name,
                  contentType: 'course' as const
              }
            : undefined;

    const { is_subscribed, subscribedFeatures } = useCourseSubscription(
        slug_subtest as string
    );

    const isShowPaywall = useMemo((): boolean => {
        return (
            (!is_subscribed && !subchapter?.video?.is_free) ||
            (is_subscribed &&
                !subchapter?.video?.is_free &&
                !subscribedFeatures?.includes('material'))
        );
    }, [is_subscribed, subchapter?.video?.is_free, subscribedFeatures]);

    return (
        <div className="w-full max-w-[1368px] mx-auto lg:h-[calc(100vh-32px)] lg:overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <Button
                    href="/utbk/materi"
                    variant="secondary"
                    className="rounded-full flex items-center gap-1.5 w-fit text-sm !p-2 lg:!py-2 lg:!px-4">
                    <FaChevronLeft className="text-white w-3.5 h-3.5 lg:w-4 lg:h-4" />{' '}
                    <span className="hidden lg:block">Kembali</span>
                </Button>

                <MateriLearnNavigation />

                <div></div>
            </div>

            <div className="grid grid-cols-8 gap-6">
                <div className="w-full max-w-[844px] mx-auto col-span-8 pb-[calc(80px+24px)] lg:col-span-5 lg:pb-0">
                    {subchapter?.type_name === 'lecture' ? (
                        <VideoPlayerContainer
                            isLoadingData={isLoading}
                            subchapter_name={subchapter?.subchapter_name}
                            video={subchapter?.video}
                            next_chapter_slug={subchapter?.next_chapter_slug}
                            next_subchapter_slug={
                                subchapter?.next_subchapter_slug
                            }
                        />
                    ) : subchapter?.type_name === 'notebook' ? (
                        <MateriArticleContainer
                            subchapter={subchapter as SubChapter}
                            book={book}
                            content={content}
                        />
                    ) : (
                        <div className="animate-pulse aspect-video bg-[#333333] rounded-lg"></div>
                    )}

                    {subchapter?.type_name === 'lecture' && !isShowPaywall ? (
                        <>
                            {course ? (
                                <p className="text-white text-xs mt-4 lg:text-base lg:mt-10">
                                    Kelas Persiapan UTBK SNBT -{' '}
                                    {course.course_name}
                                </p>
                            ) : (
                                <div className="mt-10 animate-pulse bg-[#333333] w-64 h-4 rounded-full"></div>
                            )}

                            {subchapter ? (
                                <h1 className="text-white font-bold text-base mt-3 lg:text-2xl lg:mt-4">
                                    {subchapter.subchapter_name}
                                </h1>
                            ) : (
                                <div className="mt-4 animate-pulse bg-[#333333] w-[512px] h-5 rounded-full"></div>
                            )}
                        </>
                    ) : (
                        <></>
                    )}

                    {subchapter?.type_name === 'lecture' && !isShowPaywall ? (
                        <div className="flex flex-col">
                            <div className="order-2 lg:order-1 flex items-center gap-3 mt-6 lg:mt-4">
                                {subchapter?.video?.transcript ? (
                                    <Button
                                        disabled={!course || !subchapter}
                                        onClick={() =>
                                            setIsTranscriptOpen(true)
                                        }
                                        variant="neutral"
                                        className="group flex-shrink flex items-center gap-1.5 text-sm !p-2 lg:!py-2 lg:!px-4">
                                        <TranscriptIcon className="fill-white w-4 h-4 group-disabled:fill-neutral-300/30" />
                                        <span className="hidden lg:block">
                                            Transcript
                                        </span>
                                    </Button>
                                ) : (
                                    <></>
                                )}

                                {isAuthenticated ? (
                                    <div className="flex-shrink-0">
                                        <RatingButton
                                            disabled={!course || !subchapter}
                                        />
                                    </div>
                                ) : (
                                    <></>
                                )}

                                <div className="flex-shrink-0">
                                    <ShareButton
                                        disabled={!course || !subchapter}
                                        typeCopy="COURSE VIDEO"
                                        shareCopy={`Coba deh nonton Video ${subchapter?.subchapter_name} dari Gradient Academy!`}
                                    />
                                </div>

                                <Button
                                    disabled={!course || !subchapter}
                                    onClick={() => setIsCopilotModalOpen(true)}
                                    variant="primary"
                                    className="flex-grow max-w-[256px] flex-shrink-0 !py-2 !px-4 flex justify-center items-center gap-1.5 text-sm [&>svg]:w-4 [&>svg]:h-4 lg:flex-grow-0">
                                    <CopilotIconFill />
                                    <span>Tanya Copilot AI</span>
                                </Button>

                                <CopilotModal
                                    key={subchapter?.chapter_id}
                                    isOpen={isCopilotModalOpen}
                                    setOpen={setIsCopilotModalOpen}
                                    xlWidth="xl:w-[29.5rem]"
                                    currentContext={currentVideoContext}
                                    chapterId={subchapter?.chapter_id}
                                />
                            </div>

                            <div className="order-1 mt-3 lg:order-2 lg:mt-10">
                                {subchapter ? (
                                    <LecturerProfile
                                        lecturers={subchapter.video?.lecturers}
                                    />
                                ) : (
                                    <div className="animate-pulse flex items-center gap-3">
                                        <div className="bg-[#333333] shrink-0 rounded-full w-11 h-11"></div>
                                        <div className="space-y-3">
                                            <div className="bg-[#333333] w-32 h-4 rounded-full"></div>
                                            <div className="bg-[#333333] w-64 h-3 rounded-full"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>

                {isDesktopBreakpoints ? (
                    course && subchapter ? (
                        <MateriDetailBox
                            course={course}
                            transcript={subchapter.video?.transcript}
                            isTranscriptOpen={isTranscriptOpen}
                            setIsTranscriptOpen={setIsTranscriptOpen}
                        />
                    ) : (
                        <div className="col-span-3 animate-pulse w-full bg-[#333333] h-[calc(100vh-32px-36px-16px)] rounded-2xl" />
                    )
                ) : (
                    <></>
                )}

                {!isDesktopBreakpoints ? (
                    course && subchapter ? (
                        <MateriDetailSheet
                            course={course}
                            transcript={subchapter.video?.transcript}
                            isTranscriptOpen={isTranscriptOpen}
                            setIsTranscriptOpen={setIsTranscriptOpen}
                            next_chapter_slug={
                                subchapter.next_chapter_slug as string
                            }
                            next_subchapter_slug={
                                subchapter.next_subchapter_slug as string
                            }
                            next_subchapter_name={
                                subchapter.next_subchapter_name as string
                            }
                        />
                    ) : (
                        <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-[#333333] rounded-tl-2xl rounded-tr-2xl" />
                    )
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export { MateriLearnContainer };
