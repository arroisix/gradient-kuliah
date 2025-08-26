import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import 'react-tabs/style/react-tabs.css';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import { useGetActiveSubscriptionQuery } from 'payment/redux/api/subscriptionApi';
// import Sort from 'commons/components/elements/Sort';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import CourseProgress from './courseProgress';
import { useGetCourseProgressV2Query } from 'courses/redux/api/courseV2Api';
import {
    PrivateCourseList,
    PublicCourseList
} from 'courses/components/CourseList';
import CourseTabs from 'courses/components/CourseTabs';
import React, { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { useDebounce } from 'use-debounce';
import DownloadBanner from 'courses/components/Downloads/DownloadBanner';
import { useRouter } from 'next/router';
import ForYouSections from 'courses/components/ForYouSections';
import RegisterBanner from 'dashboard/components/RegisterBanner';

// const SORT_OPTIONS = [
//     { value: 'latest', label: 'Terakhir Rilis' },
//     { value: 'popularity', label: 'Terpopuler' },
//     { value: 'lexicography', label: 'A -> Z' }
// ];

const ClassContainer = ({
    courses
}: {
    courses: ListResponseData<Course>;
}): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500, {
        maxWait: 1000
    });

    const router = useRouter();
    const { tab: currentTab } = router.query as { tab?: string };

    const isForYouView =
        (isAuthenticated && currentTab === 'for-you') ||
        (!isAuthenticated && (!currentTab || currentTab === 'all'));

    const { data: courseProgresses } = useGetCourseProgressV2Query(undefined, {
        skip: !isAuthenticated
    });
    const { data: activePacket } = useGetActiveSubscriptionQuery(undefined, {
        skip: !isAuthenticated
    });

    return (
        <>
            <Breadcrumb className="w-full pb-5" />
            <div className="relative grid w-full grid-cols-1 mx-auto xl:max-w-screen-2xl">
                <DownloadBanner />

                {isAuthenticated && courseProgresses && (
                    <CourseProgress courseProgresses={courseProgresses} />
                )}
                <h1 className="text-xl font-bold md:text-2xl">
                    Kelas &amp; Video Perkuliahan Online Terbaik
                </h1>
                <CourseTabs />
                <div className="sticky z-30 flex items-center justify-between py-2 bg-black top-28">
                    <div className="relative flex-grow mr-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari kelas"
                            className="w-full px-4 py-2 text-white border rounded-full bg-graphite-800 placeholder:text-graphite-600 border-graphite-600/50"
                        />
                        <IoIosSearch
                            size={20}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#DADADA] cursor-pointer"
                        />
                    </div>
                    {/* {isAuthenticated && (
                        <Sort
                            options={SORT_OPTIONS}
                            defaultSelected="latest"
                            className="sticky z-30 py-2 top-28"
                        />
                    )} */}
                </div>

                {!isAuthenticated && (
                    <div className="mb-4">
                        <RegisterBanner />
                    </div>
                )}

                {isForYouView ? (
                    <ForYouSections search={debouncedSearchTerm} />
                ) : isAuthenticated ? (
                    <PrivateCourseList search={debouncedSearchTerm} />
                ) : (
                    <PublicCourseList
                        courses={courses}
                        search={debouncedSearchTerm}
                    />
                )}
                {!(activePacket && activePacket.subscription_id) && (
                    <RenewSubscriptionBanner product="materi" />
                )}
            </div>
        </>
    );
};

export default ClassContainer;
