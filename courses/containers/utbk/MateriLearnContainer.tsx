import Button from 'commons/components/elements/Button';
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';
import VideoPlayerContainer from 'courses/components/VideoPlayerContainer';
import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { useGetSubchapterDetailV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useGetPublicSubchapterDetailV2Query } from 'courses/redux/api/publicCourseV2Api';
import { useGetCourseDetailQuery } from 'courses/redux/api/courseApi';
import RatingButton from 'courses/components/CourseRatingButton';
import ShareContentButton from 'courses/components/ShareContentButton';
import { useState } from 'react';
import CopilotIconFill from 'copilot/assets/CopilotIconFill';
import { TranscriptIcon } from 'commons/components/elements/Icons/TranscriptIcon';
import CopilotModal from 'copilot/components/CopilotModal';
import { LecturerProfile } from 'courses/components/utbk/LecturerProfile';

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
        <div className="pt-4 w-full max-w-[1368px] mx-auto">
            <div className="flex justify-between items-center mb-4">
                <Button
                    href="/utbk/materi"
                    variant="secondary"
                    className="rounded-full flex items-center gap-1.5 !py-2 !px-4 w-fit text-sm">
                    <FaChevronLeft className="text-white w-4 h-4" /> Kembali
                </Button>

                <details className="dropdown group">
                    <summary
                        role="button"
                        className={`${
                            !course || !subchapter ? 'pointer-events-none' : ''
                        } hidden-summary text-white font-bold text-2xl flex items-center gap-2.5`}>
                        Penalaran Kualitatif
                        <FaChevronDown className="text-[#999999] w-4 h-4 group-open:-rotate-180 transition-all duration-300" />
                    </summary>

                    <ul className="menu dropdown-content w-64 bg-slate-600 mt-2">
                        <li>Item 1</li>
                        <li>Item 2</li>
                    </ul>
                </details>

                <div></div>
            </div>

            <div className="grid grid-cols-8 gap-6">
                <div className="col-span-5 w-full max-w-[844px]">
                    <VideoPlayerContainer
                        isLoadingData={isLoading}
                        subchapter_name={subchapter?.subchapter_name}
                        video={subchapter?.video}
                        next_subchapter_slug={subchapter?.next_subchapter_slug}
                    />

                    {course ? (
                        <p className="mt-10 text-white">
                            Kelas Persiapan UTBK SNBT - {course.course_name}
                        </p>
                    ) : (
                        <div className="mt-10 animate-pulse bg-[#333333] w-64 h-4 rounded-full"></div>
                    )}

                    {subchapter ? (
                        <h1 className="text-white font-bold text-2xl mt-4">
                            {subchapter.subchapter_name}
                        </h1>
                    ) : (
                        <div className="mt-4 animate-pulse bg-[#333333] w-[512px] h-5 rounded-full"></div>
                    )}

                    <div className="flex items-center gap-3 mt-4">
                        <Button
                            disabled={!course || !subchapter}
                            onClick={() => setIsCopilotModalOpen(true)}
                            variant="neutral"
                            className="group flex-shrink-0 !py-2 !px-4 flex items-center gap-1.5 text-sm [&>svg]:w-4 [&>svg]:h-4">
                            <TranscriptIcon className="fill-white w-4 h-4 group-disabled:fill-neutral-300/30" />
                            <span>Transcript</span>
                        </Button>

                        <div className="flex-shrink-0 [&_button]:text-sm [&_svg]:w-4 [&_svg]:h-4">
                            <RatingButton disabled={!course || !subchapter} />
                        </div>

                        <div className="flex-shrink-0 [&_button]:text-sm [&_svg]:w-4 [&_svg]:h-4">
                            <ShareContentButton
                                disabled={!course || !subchapter}
                                typeCopy="COURSE VIDEO"
                                shareCopy={`Coba deh nonton Video ${subchapter?.subchapter_name} dari Gradient Academy!`}
                            />
                        </div>

                        <Button
                            disabled={!course || !subchapter}
                            onClick={() => setIsCopilotModalOpen(true)}
                            variant="primary"
                            className="flex-shrink-0 !py-2 !px-4 flex items-center gap-1.5 text-sm [&>svg]:w-4 [&>svg]:h-4">
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

                    {subchapter ? (
                        <LecturerProfile
                            lecturers={subchapter.video?.lecturers}
                        />
                    ) : (
                        <div className="animate-pulse flex items-center gap-3 mt-10">
                            <div className="bg-[#333333] rounded-full w-11 h-11"></div>
                            <div className="space-y-3">
                                <div className="bg-[#333333] w-32 h-4 rounded-full"></div>
                                <div className="bg-[#333333] w-64 h-3 rounded-full"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-span-3 w-full max-w-[500px] bg-[#333333] h-screen"></div>
            </div>
        </div>
    );
}

export { MateriLearnContainer };
