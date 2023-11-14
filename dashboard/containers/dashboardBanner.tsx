import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import OfferNotification from 'dashboard/components/OfferNotification';
import RegisterBanner from 'dashboard/components/RegisterBanner';
import SubscribeBanner from 'dashboard/components/SubscribeBanner';
import TutorBanner from 'dashboard/components/TutorBanner';
import React from 'react';
import { useSelector } from 'react-redux';

const DashboardBanner = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { is_subscribed, isLoading } = useCourseSubscription();
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    if (!isAuthenticated) return <RegisterBanner />;

    return !isLoading && is_subscribed ? (
        <TutorBanner />
    ) : isLandingPageRevampOn ? (
        <SubscribeBanner />
    ) : (
        <OfferNotification />
    );
};

export default DashboardBanner;
