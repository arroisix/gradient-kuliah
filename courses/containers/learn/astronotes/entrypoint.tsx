import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import ContinueReadingSection from 'courses/components/LearningExperience/AstroNotes/Entrypoint/ContinueReadingSection';
import {
    EntrypointPrivate,
    EntrypointPublic
} from 'courses/components/LearningExperience/AstroNotes/Entrypoint/EntrypointContent';
import EntrypointSort from 'courses/components/LearningExperience/AstroNotes/Entrypoint/EntrypointFilters';
import EntrypointTabs from 'courses/components/LearningExperience/AstroNotes/Entrypoint/EntrypointTabs';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import { useGetActiveSubscriptionQuery } from 'payment/redux/api/subscriptionApi';
import React from 'react';
import { useSelector } from 'react-redux';

const AstronotesEntrypoint = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: activePacket } = useGetActiveSubscriptionQuery(undefined, {
        skip: !isAuthenticated
    });

    return (
        <div className="relative grid w-full grid-cols-1 mx-auto xl:max-w-screen-2xl">
            {isAuthenticated && <ContinueReadingSection />}
            <h1 className="text-xl font-bold md:text-2xl">Perpustakaan</h1>
            <EntrypointTabs />
            {isAuthenticated && <EntrypointSort />}
            {isAuthenticated ? <EntrypointPrivate /> : <EntrypointPublic />}
            {!(activePacket && activePacket.subscription_id) && (
                <RenewSubscriptionBanner product="materi" />
            )}
        </div>
    );
};

export default AstronotesEntrypoint;
