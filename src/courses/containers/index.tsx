import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from 'src/authentication/contexts/AuthProvider';
import Input from 'src/commons/components/elements/Form/input';
import Switch from 'src/commons/components/elements/Form/switch';
import PrivateCourses from './privateCourses';
import PublicCourses from './publicCourses';

const ClassContainer = ({ courses }: { courses: Course[] }): JSX.Element => {
    const router = useRouter();
    const { flag } = router.query;
    const [myClass, setMyClass] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (flag && flag === 'kelasku') {
            setMyClass(true);
        }
    }, [flag]);

    return (
        <section className="min-h-screen pt-24 px-[7.5rem]">
            <h1 className="text-5xl font-bold">Kelas</h1>
            <div className="w-full flex mt-6 justify-between">
                <div className="w-1/3">
                    <Input
                        type="text"
                        placeholder="cari kelas"
                        className="bg-neutral-900 border-neutral-900 border-none"
                        name="password"
                        endAddorment={
                            <FaSearch className="text-gray-500 cursor-pointer" />
                        }
                    />
                </div>
                {isAuthenticated() && (
                    <Switch
                        label="Tampilkan kelasku saja"
                        checked={myClass}
                        setChecked={() => setMyClass(!myClass)}
                    />
                )}
            </div>
            {isAuthenticated() ? (
                <PrivateCourses myClass={myClass} />
            ) : (
                <PublicCourses courses={courses} />
            )}
        </section>
    );
};

export default ClassContainer;
