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

    return (
        <section
            className={cn(
                'min-h-screen',
                !isAuthenticated &&
                    !isLandingPageRevampOn &&
                    'px-4 md:px-[7.5rem]'
            )}>
            <h1 className="text-4xl font-bold md:text-5xl">Kelas</h1>
            <div className="flex flex-col justify-end w-full mt-6 md:flex-row">
                {/* <div className="w-full md:w-1/3">
                    <Input
                    type="text"
                    placeholder="cari kelas"
                    className="border-none bg-neutral-900 border-neutral-900"
                    name="password"
                    endAddorment={
                        <FaSearch className="text-gray-500 cursor-pointer" />
                    }
                    />
                </div> */}
            </div>
            <div className="my-4">
                {isAuthenticated ? (
                    <PrivateCourses myClass={myClass} />
                ) : (
                    <PublicCourses />
                )}
            </div>
        </section>
    );
};

export default ClassContainer;
