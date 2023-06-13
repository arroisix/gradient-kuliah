import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// import { FaSearch } from 'react-icons/fa';
// import Input from 'src/commons/components/elements/Form/input';
import PrivateCourses from './privateCourses';
import PublicCourses from './publicCourses';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';

const ClassContainer = (): JSX.Element => {
    const router = useRouter();
    const { flag } = router.query;
    const [myClass, setMyClass] = useState(false);
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        if (flag && flag === 'kelasku') {
            setMyClass(true);
        }
    }, [flag]);

    return (
        <section
            className={`min-h-screen ${
                !isAuthenticated ? 'px-4 md:px-[7.5rem]' : ''
            }`}>
            <h1 className="text-4xl md:text-5xl font-bold">Kelas</h1>
            <div className="w-full flex flex-col md:flex-row mt-6 justify-end">
                {/* <div className="md:w-1/3 w-full">
                    <Input
                    type="text"
                    placeholder="cari kelas"
                    className="bg-neutral-900 border-neutral-900 border-none"
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
