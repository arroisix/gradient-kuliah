import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetSubchapterDetailQuery } from 'courses/redux/api/privateCourseApi';
import { useRouter } from 'next/router';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

interface LearningContextType {
    video: Video;
    subchapter?: SubChapter;
    is_subscribed?: boolean;
    latest_subchapter?: SubchapterProgress;
    learning_progress_id?: string;
    subchapter_progress?: SubchapterProgress[];
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
    const { id, sub } = router.query;

    const {
        is_subscribed,
        learning_progress_id,
        latest_subchapter,
        subchapter_progress
    } = useCourseSubscription(id as string);
    const { data } = useGetSubchapterDetailQuery(sub as string, {
        skip: sub === null || sub === undefined || !isAuthenticated
    });

    const memoedValue = useMemo(
        () => ({
            video: data?.video as Video,
            subchapter: data,
            is_subscribed,
            learning_progress_id,
            latest_subchapter,
            subchapter_progress
        }),
        [
            data,
            is_subscribed,
            latest_subchapter,
            subchapter_progress,
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
