import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
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
    const [navigation, setNavigation] =
        useState<CourseDetailNavigation>('VIDEO');

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
    const duration = moment
        .utc(learningProgress?.total_duration as number)
        .format('(H[h] mm[m])');
    return (
        <>
            <div
                className="relative w-full h-full bg-[#121212] lg:overflow-hidden"
                ref={boxRef}>
                {!isOnScreen && !checkCustomBreakpoints(1024) && (
                    <div className="w-full h-[40px] absolute bottom-0 bg-gradient-to-b from-transparent to-[#121212] z-[1]"></div>
                )}
                <div
                    className="flex flex-col gap-4 py-4 px-5 md:px-16 lg:px-4 bg-[#1D1D1D]"
                    ref={headerBoxRef}>
                    <div className="flex items-center justify-between">
                        <h2 className="overflow-hidden font-sans text-base font-extrabold xl:text-lg whitespace-nowrap text-ellipsis">
                            {course?.course_name}
                        </h2>
                        <span className="min-w-[100px] text-right font-body font-extrabold text-base xl:text-lg text-white/50 pl-1">
                            {duration}
                        </span>
                        {is_subscribed && <FeedbackButton />}
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

const FeedbackButton = (): JSX.Element => {
    const router = useRouter();
    const { id } = router.query as { id: string };
    const tracker = useTracker();
    const [isModalFeedbackOpen, setIsModalFeedbackOpen] = useState(false);

    return (
        <>
            <ModalCourseFeedback
                isOpen={isModalFeedbackOpen}
                setOpen={setIsModalFeedbackOpen}
            />
            <div className="w-5 grow">
                <MdStarPurple500
                    size={20}
                    className="ml-auto mr-0 cursor-pointer text-neutral-400 hover:text-white"
                    onClick={() => {
                        tracker?.genericTrack('Click Give Rating Button', {
                            'Course Slug': id
                        });
                        setIsModalFeedbackOpen(true);
                    }}
                />
            </div>
        </>
    );
};

export default CourseDetailBox;
