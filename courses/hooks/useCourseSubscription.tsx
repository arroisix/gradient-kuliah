import { useGetActiveSubscriptionBySlugQuery } from 'payment/redux/api/subscriptionApi';
import { countTheDay } from 'payment/utils';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetLearningProgressQuery } from 'courses/redux/api/privateCourseApi';

const useCourseSubscription = (slug: string) => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data, isLoading: isLoadingSubscription } =
        useGetActiveSubscriptionBySlugQuery(slug, {
            skip: !isAuthenticated || slug === undefined,
            refetchOnMountOrArgChange: true
        });
    const { data: learningProgress, isLoading: isLoadingLearningProgress } =
        useGetLearningProgressQuery(slug, {
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
        if (data?.id) return true;

        return false;
    };

    return {
        subscription_id: data?.id,
        is_subscribed: checkIsSubscribed(),
        expiryDay,
        isLoading: isLoadingSubscription || isLoadingLearningProgress,
        learning_progress_id: learningProgress?.id,
        ...learningProgress
    };
};

export default useCourseSubscription;
