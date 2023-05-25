import { useGetActiveSubscriptionQuery } from 'payment/redux/api/subscriptionApi';
import { countTheDay } from 'payment/utils';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetLearningProgressQuery } from 'courses/redux/api/learningExperienceApi';

const useCourseSubscription = (slug?: string) => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data, isLoading: isLoadingSubscription } =
        useGetActiveSubscriptionQuery(undefined, {
            skip: !isAuthenticated,
            refetchOnMountOrArgChange: true
        });
    const { data: learningProgress, isLoading: isLoadingLearningProgress } =
        useGetLearningProgressQuery(slug as string, {
            skip: !isAuthenticated || slug === undefined,
            refetchOnMountOrArgChange: true
        });
    const [expiryDay, setExpiryDay] = useState(30);

    useEffect(() => {
        if (data) {
            setExpiryDay(countTheDay(data.deactivate_after as string) + 1);
        }
    }, [data]);

    const checkIsSubscribed = (): boolean => {
        if (data?.subscription_id && data.is_all_courses) return true;

        if (data?.subscription_id && !data.is_all_courses)
            return data.courses.includes(slug as string);

        return false;
    };

    return {
        subscription_id: data?.subscription_id,
        packet_id: data?.packet_id,
        is_subscribed: checkIsSubscribed(),
        expiryDay,
        isLoading: isLoadingSubscription || isLoadingLearningProgress,
        learning_progress_id: learningProgress?.id,
        ...learningProgress
    };
};

export default useCourseSubscription;
