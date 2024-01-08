import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import OfferNotification from 'dashboard/components/OfferNotification';
import RegisterBanner from 'dashboard/components/RegisterBanner';
import SubscribeBanner from 'dashboard/components/SubscribeBanner';
import TutorBanner from 'dashboard/components/TutorBanner';
import React from 'react';
import { useSelector } from 'react-redux';

const DashboardBanner = (): JSX.Element | null => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed, isLoading } = useCourseSubscription();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );
    const showTutorBanner = false;

    if (!isAuthenticated) return <RegisterBanner />;

    return !isLoading && is_subscribed && showTutorBanner ? (
        <TutorBanner />
    ) : isLandingPageRevampOn && !is_subscribed ? (
        <SubscribeBanner />
    ) : !is_subscribed ? (
        <OfferNotification />
    ) : null;
};

export default DashboardBanner;
