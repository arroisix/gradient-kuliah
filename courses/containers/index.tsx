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
        padding: '0px',
        paddingTop: '2px',
        marginRight: screenWidth! > 640 ? '50px' : '30px',
        cursor: 'pointer',
        borderBottom: '0px',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        background: 'transparent'
    };

    const activeTabStyle = {
        ...tabStyle,
        color: 'white',
        borderBottom: '3px solid #7264EB'
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

    const [sort, setSort] = useState<{ key: any; label: string }>({
        key: 'latest',
        label: 'Terakhir Rilis'
    });

    const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);
    const { data: activePacket } = useGetActiveSubscriptionQuery(undefined, {
        skip: !isAuthenticated
    });

    return (
        <>
            <div
                className={cn(
                    'w-full min-h-screen',
                    !isAuthenticated &&
                        !isLandingPageRevampOn &&
                        'px-4 md:px-[7.5rem]'
                )}>
                <h1 className="text-4xl font-bold md:text-5xl">Kelas</h1>
                <Tabs
                    selectedIndex={tabIndex}
                    onSelect={(index: number) => setTabIndex(index)}
                    focusTabOnClick={false}
                    defaultFocus={false}
                    className="mt-6">
                    <div
                        className="sticky top-[60px] bg-neutral-1000"
                        style={{
                            zIndex: 100
                        }}>
                        <TabList
                            style={{
                                borderBottom: '1px solid #222222'
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
                                        {section.label}
                                    </Tab>
                                )
                            )}
                        </TabList>
                        <div className="pt-2"></div>
                        {tabIndex === 0 && (
                            <div className="pb-4">
                                <button
                                    onClick={() =>
                                        setIsSortMenuVisible((prev) => !prev)
                                    }
                                    className="bg-[#2C2C2C] border-0 rounded-full w-full md:w-[230px] py-[10px] px-[20px] flex justify-between items-center hover:bg-[#373737] duration-200">
                                    <p className="text-start">{sort.label}</p>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M17.5 5H2.5V6.66667H17.5V5Z"
                                            fill="white"
                                        />{' '}
                                        <path
                                            d="M15 9.16602H5V10.8327H15V9.16602Z"
                                            fill="white"
                                        />{' '}
                                        <path
                                            d="M12.5 13.334H7.5V15.0007H12.5V13.334Z"
                                            fill="white"
                                        />{' '}
                                    </svg>
                                </button>
                                <div
                                    className={`absolute ${
                                        !isSortMenuVisible && 'hidden'
                                    } mt-2 w-[230px] bg-[#2C2C2C] rounded-lg`}
                                    style={{ zIndex: 100 }}>
                                    {sortOptions.map(
                                        (
                                            sort: { key: any; label: string },
                                            index: number
                                        ) => (
                                            <>
                                                {index !== 0 && (
                                                    <div className="w-full h-[1px] bg-[rgba(153,153,153,0.5)]"></div>
                                                )}
                                                <button
                                                    key={sort.key}
                                                    className="w-full py-2 hover:bg-[#373737] rounded-lg duration-200"
                                                    onClick={() => {
                                                        setSort(sort);
                                                        setIsSortMenuVisible(
                                                            false
                                                        );
                                                    }}>
                                                    {sort.label}
                                                </button>
                                            </>
                                        )
                                    )}
                                </div>
                            </div>
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
