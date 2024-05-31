import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// import { FaSearch } from 'react-icons/fa';
// import Input from 'src/commons/components/elements/Form/input';
import PrivateCourses from './privateCourses';
import PublicCourses from './publicCourses';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { cn } from 'commons/utils';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import RenewSubscriptionBanner from 'courses/components/RenewSubscriptionBanner';
import { useGetActiveSubscriptionQuery } from 'payment/redux/api/subscriptionApi';
import { useGrid } from 'courses/contexts/GridProvider';
import Sort from 'commons/components/elements/Sort';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

const ClassContainer = (): JSX.Element => {
    const router = useRouter();
    const { flag } = router.query;
    const [myClass, setMyClass] = useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);
    const isLandingPageRevampOn = useFeatureIsOn<GrowthbookFeatures>(
        'landing-page-revamp'
    );

    useEffect(() => {
        if (flag && flag === 'kelasku') {
            setMyClass(true);
        }
    }, [flag]);

    const [tabIndex, setTabIndex] = useState(0);

    const { screenWidth } = useGrid();

    const tabStyle = {
        color: '#666666',
        padding: '10px',
        paddingTop: '2px',
        marginRight: screenWidth! > 640 ? '40px' : '24px',
        cursor: 'pointer',
        borderBottom: 'none',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        background: 'transparent'
    };

    const activeTabStyle = {
        ...tabStyle,
        color: 'white',
        fontWeight: 'bold',
        borderBottom: '2px solid #5f2bce'
    };

    const sectionOptions: {
        key: string;
        label: string;
    }[] = [
        { key: 'all', label: 'Semua' },
        { key: 'newly-released', label: 'Baru Rilis' },
        { key: 'coming-soon', label: 'Segera Hadir' }
    ];

    const sortOptions: {
        key: string;
        label: string;
    }[] = [
        { key: 'latest', label: 'Terakhir Rilis' },
        { key: 'popularity', label: 'Terpopuler' },
        { key: 'lexicography', label: 'A -> Z' }
    ];

    const [sort, setSort] = useState<{ key: any; label: string }>(
        sortOptions[0]
    );

    const { data: activePacket } = useGetActiveSubscriptionQuery(undefined, {
        skip: !isAuthenticated
    });
    const { is_subscribed } = useCourseSubscription()

    return (
        <>
            <div
                className={cn(
                    'w-full min-h-screen',
                    !isAuthenticated &&
                        !isLandingPageRevampOn &&
                        'px-4 md:px-[7.5rem]',
                    !is_subscribed && 'pb-8'
                )}>
                <h1 className="md:text-2xl text-xl font-bold">Kelas</h1>
                <Tabs
                    selectedIndex={tabIndex}
                    onSelect={(index: number) => setTabIndex(index)}
                    focusTabOnClick={false}
                    defaultFocus={false}
                    className="mt-6">
                    <div
                        className="sticky flex flex-col gap-4 pb-4 top-[56px] bg-neutral-1000"
                        style={{
                            zIndex: 10
                        }}>
                        <TabList
                            style={{
                                borderBottom: '1px solid #222222',
                                marginBottom: '0px'
                            }}>
                            {sectionOptions.map(
                                (
                                    section: { key: string; label: string },
                                    index: number
                                ) => (
                                    <Tab
                                        key={section.key}
                                        style={
                                            tabIndex === index
                                                ? activeTabStyle
                                                : tabStyle
                                        }>
                                        <p className="text-[14px]">
                                            {section.label}
                                        </p>
                                    </Tab>
                                )
                            )}
                        </TabList>
                        {tabIndex === 0 && (
                            <Sort
                                options={sortOptions}
                                selectedSort={sort}
                                onSelectSort={setSort}
                            />
                        )}
                    </div>
                    {sectionOptions.map(
                        (section: { key: any; label: string }) => (
                            <TabPanel key={section.key}>
                                <div>
                                    {isAuthenticated ? (
                                        <PrivateCourses
                                            myClass={myClass}
                                            section={section.key}
                                            sort={sort.key}
                                        />
                                    ) : (
                                        <PublicCourses
                                            section={section.key}
                                            sort={sort.key}
                                        />
                                    )}
                                </div>
                            </TabPanel>
                        )
                    )}
                </Tabs>
            </div>
            {!(activePacket && activePacket.subscription_id) && (
                <RenewSubscriptionBanner />
            )}
        </>
    );
};

export default ClassContainer;
