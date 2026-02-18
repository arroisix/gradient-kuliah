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
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { SearchIcon } from 'commons/components/elements/Icons/SearchIcon';
import { useDebounce } from 'use-debounce';
import { cn } from 'commons/utils';

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

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500, {
        maxWait: 1000
    });

    return (
        <div>
            <Breadcrumb className="w-full pb-5" />
            <div className="relative grid w-full grid-cols-1 mx-auto xl:max-w-screen-2xl">
                {isAuthenticated && <ContinueReadingSection />}
                <h1 className="text-white text-xl font-bold md:text-2xl text-balance">
                    {title}
                </h1>
                <EntrypointTabs />
                <div className="sticky z-[5] flex items-center justify-between gap-4 py-2 bg-black top-[74px]">
                    <div className="bg-[#101010] px-3 rounded-full flex items-center gap-2 w-full">
                        <button type="submit" className="shrink-0">
                            <SearchIcon
                                className={cn(
                                    'shrink-0 w-5 h-5 transition-all',
                                    searchTerm.trim()
                                        ? 'text-white'
                                        : 'text-[#666666]'
                                )}
                            />
                        </button>

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari kelas"
                            autoComplete="off"
                            className={cn(
                                'w-full bg-transparent placeholder:text-[#666666] border-none focus:ring-0 text-sm py-3 px-0 transition-all outline-none',
                                searchTerm.trim()
                                    ? 'text-white'
                                    : 'text-[#666666]'
                            )}
                        />
                    </div>
                    {isAuthenticated && (
                        <Sort
                            options={SORT_OPTIONS}
                            defaultSelected="last-released"
                            className="sticky z-[5] py-2 top-28"
                        />
                    )}
                </div>
                {isAuthenticated ? (
                    <EntrypointPrivate
                        category={type}
                        search={debouncedSearchTerm}
                    />
                ) : (
                    <EntrypointPublic
                        category={type}
                        books={books}
                        search={debouncedSearchTerm}
                    />
                )}
                {!(activePacket && activePacket.subscription_id) && (
                    <RenewSubscriptionBanner product="materi" />
                )}
            </div>
        </div>
    );
};

export default AstronotesEntrypoint;
