import { useGetActiveSubscriptionQuery } from 'payment/redux/api/subscriptionApi';
import { countTheDay } from 'payment/utils';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetLearningProgressQuery } from 'courses/redux/api/learningExperienceApi';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useGetCoursePreviewQuery } from 'courses/redux/api/courseApi';
import { useGetAllTransactionQuery } from 'payment/redux/api/transactionApi';

const useCourseSubscription = (slug?: string) => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const {
        data,
        isLoading: isLoadingSubscription,
        isSuccess: isDoneFetching,
        isError: isErrorFetchingSubscription
    } = useGetActiveSubscriptionQuery(!isAuthenticated ? skipToken : undefined);
    const { data: learningProgress, isLoading: isLoadingLearningProgress } =
        useGetLearningProgressQuery(slug as string, {
            skip: !isAuthenticated || slug === undefined,
            refetchOnMountOrArgChange: true
        });
    const [expiryDay, setExpiryDay] = useState(0);

    useEffect(() => {
        if (data?.deactivate_after) {
            setExpiryDay(countTheDay(data.deactivate_after as string) + 1);
        }
    }, [data]);

    const checkIsSubscribed = (): boolean => {
        if (data?.subscription_id && data.is_all_courses) return true;

        if (data?.subscription_id && !data.is_all_courses)
            return data.courses.includes(slug as string);

        return false;
    };

    const is_subscribed = checkIsSubscribed();
    const { data: coursePreview } = useGetCoursePreviewQuery(
        slug === undefined || checkIsSubscribed() ? skipToken : { slug }
    );

    const { data: allTransaction, isLoading: isTransactionLoading } =
        useGetAllTransactionQuery(
            is_subscribed || !isAuthenticated ? skipToken : undefined
        );
    const everSubscribed =
        is_subscribed ||
        allTransaction?.data.some(
            (transaction) => transaction.status === 'SUCCESS'
        );
    const lastPacketId = everSubscribed
        ? allTransaction?.data[0].subscriber.subscribed_packet.id
        : undefined;

    return {
        subscription_id: data?.subscription_id,
        packet_id: data?.packet_id,
        is_subscribed,
        everSubscribed,
        expiryDay,
        isLoading:
            isLoadingSubscription ||
            isLoadingLearningProgress ||
            isTransactionLoading,
        isDoneFetchingSubcription: isDoneFetching,
        isErrorFetchingSubscription,
        learning_progress_id: learningProgress?.id,
        coursePreview,
        lastPacketId,
        ...learningProgress
    };
};

export default useCourseSubscription;
