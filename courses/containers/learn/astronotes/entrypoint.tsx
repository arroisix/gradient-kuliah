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
import { IoIosSearch } from 'react-icons/io';
import { useDebounce } from 'use-debounce';

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
                <div className="sticky z-[5] flex items-center justify-between py-2 bg-black top-[74px]">
                    <div className="relative flex-grow mr-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari buku"
                            className="w-full px-4 py-2 text-white border rounded-full bg-graphite-800 placeholder:text-graphite-600 border-graphite-600/50"
                        />
                        <IoIosSearch
                            size={20}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#DADADA] cursor-pointer"
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
