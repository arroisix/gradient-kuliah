import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import 'react-tabs/style/react-tabs.css';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import { useGetActiveSubscriptionQuery } from 'payment/redux/api/subscriptionApi';
import Sort from 'commons/components/elements/Sort';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import CourseProgress from './courseProgress';
import { useGetCourseProgressV2Query } from 'courses/redux/api/courseV2Api';
import {
    PrivateCourseList,
    PublicCourseList
} from 'courses/components/CourseList';
import CourseTabs from 'courses/components/CourseTabs';

const SORT_OPTIONS = [
    { value: 'latest', label: 'Terakhir Rilis' },
    { value: 'popularity', label: 'Terpopuler' },
    { value: 'lexicography', label: 'A -> Z' }
];

const ClassContainer = (): JSX.Element => {
    const isAuthenticated = useSelector(getIsAuthenticated);

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
                {isAuthenticated && courseProgresses && (
                    <CourseProgress courseProgresses={courseProgresses} />
                )}
                <h1 className="text-xl font-bold md:text-2xl">
                    Kelas &amp; Video Perkuliahan Online Terbaik
                </h1>
                <CourseTabs />
                {isAuthenticated && (
                    <Sort
                        options={SORT_OPTIONS}
                        defaultSelected="latest"
                        className="sticky z-10 py-2 bg-black top-28"
                    />
                )}
                {isAuthenticated ? <PrivateCourseList /> : <PublicCourseList />}
                {!(activePacket && activePacket.subscription_id) && (
                    <RenewSubscriptionBanner product="materi" />
                )}
            </div>
        </>
    );
};

export default ClassContainer;
