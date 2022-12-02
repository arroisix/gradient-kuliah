import { useGetActiveSubscriptionBySlugQuery } from 'payment/redux/api/subscriptionApi';
import { countTheDay } from 'payment/utils';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetLearningProgressQuery } from 'courses/redux/api/privateCourseApi';

const useCourseSubscription = (slug: string) => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data } = useGetActiveSubscriptionBySlugQuery(slug, {
        skip: !isAuthenticated
    });
    const { data: learningProgress } = useGetLearningProgressQuery(slug, {
        skip: !isAuthenticated
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
        ...learningProgress
    };
};

export default useCourseSubscription;
