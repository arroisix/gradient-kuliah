import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetPublicSubchapterDetailV2Query } from 'courses/redux/api/publicCourseV2Api';
import { useGetSubchapterDetailV2Query } from 'courses/redux/api/privateCourseV2Api';
import { useRouter } from 'next/router';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

interface LearningContextType {
    video: Video;
    subchapter?: SubChapter;
    is_subscribed?: boolean;
    latest_watch_video?: SubchapterProgress;
    learning_progress_id?: string;
    watch_progress?: SubchapterProgress[];
}

const LearningContext = createContext<LearningContextType>(
    {} as LearningContextType
);

export function LearningProvider({
    children
}: {
    children: ReactNode;
}): JSX.Element {
    const router = useRouter();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { id, slug } = router.query as { id: string; slug: string };

    const {
        is_subscribed,
        learning_progress_id,
        latest_watch_video,
        watch_progress
    } = useCourseSubscription(id as string);
    const privateSubchapterDetails = useGetSubchapterDetailV2Query(
        { course_slug: id, subchapter_slug: slug },
        { skip: !id || !slug || !isAuthenticated }
    );
    const publicSubchapterDetails = useGetPublicSubchapterDetailV2Query(
        { course_slug: id, subchapter_slug: slug },
        { skip: !id || !slug }
    );
    const { data } = isAuthenticated
        ? privateSubchapterDetails
        : publicSubchapterDetails;

    const memoedValue = useMemo(
        () => ({
            video: data?.video as Video,
            subchapter: data,
            is_subscribed,
            learning_progress_id,
            latest_watch_video,
            watch_progress
        }),
        [
            data,
            is_subscribed,
            latest_watch_video,
            watch_progress,
            learning_progress_id
        ]
    );

    return (
        <LearningContext.Provider value={memoedValue}>
            {children}
        </LearningContext.Provider>
    );
}

export const useLearning = (): LearningContextType => {
    return useContext(LearningContext);
};

export default LearningContext;
