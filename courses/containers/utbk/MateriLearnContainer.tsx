import Button from 'commons/components/elements/Button';
import { FaChevronLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useGetSubchapterDetailV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicSubchapterDetailV2Query } from 'courses/redux/api/publicCourseV2Api';
import { useGetCourseDetailQuery } from 'courses/redux/api/courseApi';
import { useMemo, useState } from 'react';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { MateriLearnNavigation } from 'courses/components/utbk/MateriLearnNavigation';
import dynamic from 'next/dynamic';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { BelajarPageProps } from 'pages/utbk/materi/[slug_subtest]/[slug_chapter]/[slug_subchapter]';
import MateriArticleContainer from 'courses/components/MateriArticleContainer';
import MateriQuizContainer from 'courses/components/MateriQuizContainer';

const MateriDetailBox = dynamic(
    () => import('courses/components/utbk/MateriDetailBox')
);

const MateriDetailSheet = dynamic(
    () => import('courses/components/utbk/MateriDetailSheet')
);

const VideoPlayerContainer = dynamic(
    () => import('courses/components/VideoPlayerContainer')
);

const MateriVideoProfile = dynamic(
    () => import('courses/components/utbk/MateriVideoProfile')
);

function MateriLearnContainer({
    subchapter: ssrSubchapter,
    course: ssrCourse,
    book,
    content
}: BelajarPageProps): JSX.Element {
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

    const router = useRouter();
    const { slug_subtest, slug_subchapter } = useMemo(() => {
        if (!router.isReady) {
            return { slug_subtest: '', slug_subchapter: '' };
        }

        const parts = router.asPath
            .split('?')[0]
            .split('/')
            .filter((v) => v !== '');

        return {
            slug_subtest: parts[2] ?? '',
            slug_subchapter: parts[4] ?? ''
        };
    }, [router.asPath, router.isReady]);

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

    const { is_subscribed, subscribedFeatures } = useCourseSubscription(
        slug_subtest as string
    );

    const isExercise = subchapter?.type_name === 'exercise';
    const isShowPaywall = useMemo((): boolean => {
        return (
            (!is_subscribed && !subchapter?.video?.is_free) ||
            (is_subscribed &&
                !subchapter?.video?.is_free &&
                !subscribedFeatures?.includes('material'))
        );
    }, [is_subscribed, subchapter?.video?.is_free, subscribedFeatures]);

    return (
        <div
            className={`${
                isExercise ? 'px-0' : 'px-4'
            } w-full max-w-[1368px] mx-auto lg:h-[calc(100vh-32px)] lg:overflow-hidden`}>
            <div
                className={`${
                    isExercise ? 'mx-4' : 'mx-0'
                } flex justify-between items-center mb-4`}>
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

            <div
                className={`${
                    isExercise ? 'lg:mx-4' : ''
                } grid grid-cols-8 gap-6`}>
                <div
                    className={`${
                        isExercise ? '' : 'max-w-[844px]'
                    } w-full mx-auto col-span-8 lg:col-span-5 lg:pb-0`}>
                    {subchapter?.type_name === 'lecture' ? (
                        <div className="lg:h-[calc(100vh-32px-36px-16px)] lg:overflow-scroll lg:no-scrollbar">
                            <VideoPlayerContainer
                                isLoadingData={isLoading}
                                subchapter_name={subchapter?.subchapter_name}
                                video={subchapter?.video}
                                next_chapter_slug={
                                    subchapter?.next_chapter_slug
                                }
                                next_subchapter_slug={
                                    subchapter?.next_subchapter_slug
                                }
                            />

                            {!isShowPaywall ? (
                                <MateriVideoProfile
                                    course={course as CourseDetail}
                                    subchapter={subchapter}
                                    isTranscriptOpen={isTranscriptOpen}
                                    setIsTranscriptOpen={setIsTranscriptOpen}
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    ) : subchapter?.type_name === 'notebook' ? (
                        <MateriArticleContainer
                            subchapter={subchapter as SubChapter}
                            book={book}
                            content={content}
                        />
                    ) : subchapter?.type_name === 'exercise' ? (
                        <MateriQuizContainer
                            subchapter={subchapter as SubChapter}
                        />
                    ) : (
                        <div className="animate-pulse aspect-video bg-[#333333] rounded-2xl"></div>
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
                            isLastSubchapter={!subchapter.next_subchapter_slug}
                            isFinished={
                                subchapter.is_finished ??
                                subchapter.status === 'COMPLETED'
                            }
                            course_name={course.course_name}
                            href={
                                subchapter.next_subchapter_slug
                                    ? `/utbk/materi/${slug_subtest}/${subchapter.next_chapter_slug}/${subchapter.next_subchapter_slug}`
                                    : '/utbk/materi'
                            }
                            next_subchapter_name={
                                subchapter.next_subchapter_name as string
                            }
                        />
                    ) : (
                        <div className="animate-pulse fixed bottom-0 left-0 right-0 h-[72px] bg-[#333333] rounded-tl-2xl rounded-tr-2xl lg:hidden" />
                    )
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export { MateriLearnContainer };
