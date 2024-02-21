import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Skeleton from 'commons/components/elements/Skeleton';
import useElementSize from 'commons/hooks/useElementSize';
import useOnScreen from 'commons/hooks/useOnScreen';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useGetCourseQuery } from 'courses/redux/api/courseApi';
import { useGetLearningProgressQuery } from 'courses/redux/api/learningExperienceApi';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { MdStarPurple500 } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useTracker } from 'tracker/tracker';
import CourseDetailContent from './CourseDetailContent';
import CourseDetailTabs from './CourseDetailTabs';
import ModalCourseFeedback from './ModalCourseFeedback';
import ProgressBar from './ProgressBar';
import { CourseSubchapterSearchProvider } from 'courses/hooks/useSearchSubchapter';
import { cn } from 'commons/utils';
import { CodeEditorProvider } from 'courses/hooks/useCodeEditor';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

const CourseDetailBox = (): JSX.Element => {
    const tracker = useTracker();

    const [navigation, setNavigation] =
        useState<CourseDetailNavigation>('VIDEO');

    const [isModalFeedbackOpen, setIsModalFeedbackOpen] =
        useState<boolean>(false);

    const { checkCustomBreakpoints } = useWindowBreakpoints();
    const anchor = useRef<HTMLDivElement>({} as HTMLDivElement);
    const { height: boxHeight, ref: boxRef } = useElementSize<HTMLDivElement>();
    const { height: headerBoxHeight, ref: headerBoxRef } =
        useElementSize<HTMLDivElement>();
    const isOnScreen = useOnScreen(anchor);

    const router = useRouter();
    const { id } = router.query;

    const isAuthenticated = useSelector(getIsAuthenticated);

    const { data: learningProgress, isLoading: isLoadingLearning } =
        useGetLearningProgressQuery(id as string, {
            skip: !id || !isAuthenticated
        });
    const { data: course } = useGetCourseQuery(undefined, {
        selectFromResult: ({ data, isLoading }) => ({
            data: data?.courses.find(({ slug }) => slug === id),
            isLoading: isLoading
        })
    });
    const { is_subscribed } = useCourseSubscription();

    return (
        <>
            <ModalCourseFeedback
                isOpen={isModalFeedbackOpen}
                setOpen={setIsModalFeedbackOpen}
            />
            <div
                className="relative w-full h-full bg-[#121212] lg:overflow-hidden"
                ref={boxRef}>
                {!isOnScreen && !checkCustomBreakpoints(1024) && (
                    <div className="w-full h-[40px] absolute bottom-0 bg-gradient-to-b from-transparent to-[#121212] z-[1]"></div>
                )}
                <div
                    className="flex flex-col gap-[14px] px-5 md:px-16 lg:px-[18px] py-[18px] bg-[#1D1D1D]"
                    ref={headerBoxRef}>
                    <div className="flex items-center justify-between">
                        <h4 className="overflow-hidden font-sans text-base font-extrabold xl:text-lg whitespace-nowrap text-ellipsis">
                            {course?.course_name}
                        </h4>
                        <span className="min-w-[100px] font-body font-extrabold text-base xl:text-lg text-[#FFFFFF80] pl-1">
                            {isLoadingLearning ? (
                                <Skeleton className="h-[20px] !m-0 !p-0" />
                            ) : (
                                `(${moment
                                    .utc(
                                        learningProgress?.total_duration as number
                                    )
                                    .format('H')}h ${moment
                                    .utc(
                                        learningProgress?.total_duration as number
                                    )
                                    .format('mm')}m)`
                            )}
                        </span>
                        {is_subscribed && (
                            <div className="w-[20px] grow">
                                <MdStarPurple500
                                    size={20}
                                    className="ml-auto mr-0 cursor-pointer text-neutral-400 hover:text-white"
                                    onClick={() => {
                                        tracker?.genericTrack(
                                            'Click Give Rating Button',
                                            { 'Course Slug': id }
                                        );
                                        setIsModalFeedbackOpen(true);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <ProgressBar
                        total_finished_video={
                            learningProgress?.completion_percentage
                                ?.total_finished_video
                        }
                        total_video_count={
                            learningProgress?.completion_percentage
                                ?.total_video_count
                        }
                        isLoading={isLoadingLearning}
                    />
                </div>
                <CourseSubchapterSearchProvider>
                    <div
                        className="flex flex-col"
                        style={{
                            height: !checkCustomBreakpoints(1024)
                                ? boxHeight - headerBoxHeight
                                : '100%'
                        }}>
                        {!isLoadingLearning && (
                            <CourseDetailTabs
                                navigation={navigation}
                                setNavigation={setNavigation}
                            />
                        )}

                        <CodeEditorProvider>
                            <div
                                className={cn(
                                    'h-full lg:overflow-y-auto',
                                    navigation != 'CODE EDITOR' &&
                                        'px-5 md:px-16 lg:px-[14px] pt-[18px]'
                                )}>
                                <CourseDetailContent navigation={navigation} />
                                <div ref={anchor}></div>
                            </div>
                        </CodeEditorProvider>
                    </div>
                </CourseSubchapterSearchProvider>
            </div>
        </>
    );
};

export default CourseDetailBox;
