import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Sort from 'commons/components/elements/Sort';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import ContinueReadingSection from 'courses/components/LearningExperience/AstroNotes/Entrypoint/ContinueReadingSection';
import {
    EntrypointPrivate,
    EntrypointPublic
} from 'courses/components/LearningExperience/AstroNotes/Entrypoint/EntrypointContent';
import EntrypointTabs from 'courses/components/LearningExperience/AstroNotes/Entrypoint/EntrypointTabs';
import {
    SORT_OPTIONS,
    Tab
} from 'courses/components/LearningExperience/AstroNotes/constants';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import { useRouter } from 'next/router';
import { useGetActiveSubscriptionQuery } from 'payment/redux/api/subscriptionApi';
import React from 'react';
import { useSelector } from 'react-redux';

const AstronotesEntrypoint = ({
    title = 'Perpustakaan',
    books
}: {
    title?: string;
    books: ListResponseData<Astronote>;
}): JSX.Element => {
    const router = useRouter();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: activePacket } = useGetActiveSubscriptionQuery(undefined, {
        skip: !isAuthenticated
    });

    const suffix = router.pathname.split('/perpustakaan')[1];
    let type = Tab.all;
    if (suffix === '/astronotes') type = Tab.astronotes;
    if (suffix === '/textbook') type = Tab.textbook;
    if (suffix === '/bank-soal') type = Tab.soal;

    return (
        <>
            <Breadcrumb className="w-full pb-5" />
            <div className="relative grid w-full grid-cols-1 mx-auto xl:max-w-screen-2xl">
                {isAuthenticated && <ContinueReadingSection />}
                <h1 className="text-xl font-bold md:text-2xl text-balance">
                    {title}
                </h1>
                <EntrypointTabs />
                {isAuthenticated && (
                    <Sort
                        options={SORT_OPTIONS}
                        defaultSelected="last-released"
                        className="sticky z-10 py-2 bg-black top-28"
                    />
                )}
                {isAuthenticated ? (
                    <EntrypointPrivate category={type} />
                ) : (
                    <EntrypointPublic category={type} books={books} />
                )}
                {!(activePacket && activePacket.subscription_id) && (
                    <RenewSubscriptionBanner product="materi" />
                )}
            </div>
        </>
    );
};

export default AstronotesEntrypoint;
