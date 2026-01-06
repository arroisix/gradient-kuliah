import Button from 'commons/components/elements/Button';
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';
import VideoPlayerContainer from 'courses/components/VideoPlayerContainer';
import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useGetSubchapterDetailV2Query } from 'courses/redux/api/privateCourseV2Api';
import {
    useGetPublicListCoursesV2Query,
    useGetPublicSubchapterDetailV2Query
} from 'courses/redux/api/publicCourseV2Api';
import { useGetCourseDetailQuery } from 'courses/redux/api/courseApi';
import { RatingButton } from 'courses/components/utbk/RatingButton';
import { ShareButton } from 'courses/components/utbk/ShareButton';
import { useState } from 'react';
import CopilotIconFill from 'copilot/assets/CopilotIconFill';
import { TranscriptIcon } from 'commons/components/elements/Icons/TranscriptIcon';
import CopilotModal from 'copilot/components/CopilotModal';
import { LecturerProfile } from 'courses/components/utbk/LecturerProfile';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { MateriDetailBox } from 'courses/components/utbk/MateriDetailBox';
import { useGetPrivateListCoursesV2Query } from 'courses/redux/api/privateCourseV2Api';
import { CourseMenuItem } from 'courses/components/utbk/CourseMenuItem';
import { MateriDetailSheet } from 'courses/components/utbk/MateriDetailSheet';

interface MateriLearnContainerProps {
    subchapter: SubChapter | undefined;
    course: CourseDetail | undefined;
}

function MateriLearnContainer({
    subchapter: ssrSubchapter,
    course: ssrCourse
}: MateriLearnContainerProps): JSX.Element {
    const [isCopilotModalOpen, setIsCopilotModalOpen] =
        useState<boolean>(false);

    const router = useRouter();
    const { slug_subtest, slug_subchapter } = router.query as {
        slug_subtest: string;
        slug_subchapter: string;
    };

    const { isAuthenticated } = useAuth();
    const { isDesktopBreakpoints } = useWindowBreakpoints();

    const { isLoading: isPublicCoursesLoading, data: publicCourses } =
        useGetPublicListCoursesV2Query(
            { type: 'UTBK' },
            { skip: isAuthenticated }
        );

    const { isLoading: isPrivateCoursesLoading, data: privateCourses } =
        useGetPrivateListCoursesV2Query({}, { skip: !isAuthenticated });

    const courses = publicCourses
        ? publicCourses.data
        : privateCourses
        ? privateCourses.data
        : [];

    const privateSubchapterDetails = useGetSubchapterDetailV2Query(
        { course_slug: slug_subtest, subchapter_slug: slug_subchapter },
        { skip: !slug_subtest || !slug_subchapter || !isAuthenticated }
    );

    const publicSubchapterDetails = useGetPublicSubchapterDetailV2Query(
        { course_slug: slug_subtest, subchapter_slug: slug_subchapter },
        { skip: !slug_subtest || !slug_subchapter }
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

    return (
        <div className="w-full max-w-[1368px] mx-auto">
            <div className="flex justify-between items-center mb-4">
                <Button
                    href="/utbk/materi"
                    variant="secondary"
                    className="rounded-full flex items-center gap-1.5 w-fit text-sm !p-2 lg:!py-2 lg:!px-4">
                    <FaChevronLeft className="text-white w-3.5 h-3.5 lg:w-4 lg:h-4" />{' '}
                    <span className="hidden lg:block">Kembali</span>
                </Button>

                <details className="dropdown group">
                    <summary
                        role="button"
                        className={`${
                            isPrivateCoursesLoading || isPublicCoursesLoading
                                ? 'pointer-events-none'
                                : ''
                        } hidden-summary text-white font-bold text-base flex items-center gap-2.5 lg:text-2xl`}>
                        Penalaran Kualitatif
                        <FaChevronDown className="text-white w-3.5 h-3.5 lg:w-4 lg:h-4 group-open:-rotate-180 transition-all duration-300" />
                    </summary>

                    <ul className="menu dropdown-content z-50 left-1/2 -translate-x-1/2 bg-black grid grid-cols-2 gap-x-8 gap-y-6 w-screen max-w-[896px] rounded-2xl p-6 mt-10">
                        {courses.map((course) => (
                            <CourseMenuItem key={course.id} course={course} />
                        ))}
                    </ul>
                </details>

                <div></div>
            </div>

            <div className="grid grid-cols-8 gap-6">
                <div className="col-span-8 lg:col-span-5 w-full max-w-[844px] mx-auto">
                    <VideoPlayerContainer
                        isLoadingData={isLoading}
                        subchapter_name={subchapter?.subchapter_name}
                        video={subchapter?.video}
                        next_subchapter_slug={subchapter?.next_subchapter_slug}
                    />

                    {course ? (
                        <p className="text-white text-xs mt-4 lg:text-base lg:mt-10">
                            Kelas Persiapan UTBK SNBT - {course.course_name}
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

                    <div className="flex flex-col">
                        <div className="order-2 lg:order-1 flex items-center gap-3 mt-6 lg:mt-4">
                            <Button
                                disabled={!course || !subchapter}
                                variant="neutral"
                                className="group flex-shrink flex items-center gap-1.5 text-sm !p-2 lg:!py-2 lg:!px-4">
                                <TranscriptIcon className="fill-white w-4 h-4 group-disabled:fill-neutral-300/30" />
                                <span className="hidden lg:block">
                                    Transcript
                                </span>
                            </Button>

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
                                    <div className="bg-[#333333] rounded-full w-11 h-11"></div>
                                    <div className="space-y-3">
                                        <div className="bg-[#333333] w-32 h-4 rounded-full"></div>
                                        <div className="bg-[#333333] w-64 h-3 rounded-full"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isDesktopBreakpoints ? (
                    course && subchapter ? (
                        <MateriDetailBox course={course} />
                    ) : (
                        <div className="col-span-3 animate-pulse w-full max-w-[500px] bg-[#333333] h-full rounded-2xl" />
                    )
                ) : (
                    <></>
                )}

                {!isDesktopBreakpoints ? (
                    course && subchapter ? (
                        <MateriDetailSheet
                            course={course}
                            next_subchapter_slug={
                                subchapter.next_subchapter_slug as string
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
