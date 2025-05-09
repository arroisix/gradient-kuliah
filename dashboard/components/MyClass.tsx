import { skipToken } from '@reduxjs/toolkit/dist/query';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import useTransition from 'commons/hooks/useTransition';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useGetStudentCourseQuery } from 'dashboard/redux/api/dashboardApi';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HiChevronDown, HiOutlinePlusSm } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useTracker } from 'tracker/tracker';
import { StudentCourse } from '../types/dashboard';

const MyClass = ({ className }: { className?: string }): JSX.Element => {
    const router = useRouter();
    const loadingTransition = useTransition(router);
    const { isMobileBreakpoints, isTabletBreakpoints } = useWindowBreakpoints();

    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data, isLoading } = useGetStudentCourseQuery(
        !isAuthenticated ? skipToken : undefined
    );

    const [isShow, setIsShow] = useState(false);

    function handleShowClass(): void {
        if (isMobileBreakpoints || isTabletBreakpoints) {
            setIsShow((prev) => !prev);
        }
    }

    return (
        <div className={`flex flex-col gap-3 md:gap-5 ${className}`}>
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={handleShowClass}
                aria-hidden>
                <h4 className="text-lg font-extrabold">Kelasku</h4>
                <HiChevronDown
                    size={22}
                    className={`lg:hidden ${
                        isShow && 'rotate-180'
                    } transition-all`}
                />
            </div>
            {(isShow || (!isMobileBreakpoints && !isTabletBreakpoints)) && (
                <div>
                    {isLoading ? (
                        <div className="flex flex-col gap-3">
                            <div className="w-full h-8 py-2 px-4 rounded-[20px] bg-neutral-800 text-neutral-800 animate-pulse"></div>
                            <div className="w-full h-8 py-2 px-4 rounded-[20px] bg-neutral-800 text-neutral-800 animate-pulse"></div>
                            <div className="w-full h-8 py-2 px-4 rounded-[20px] bg-neutral-800 text-neutral-800 animate-pulse"></div>
                        </div>
                    ) : (
                        <>
                            {data?.courses.length === 0 ? (
                                <div
                                    className="flex justify-center items-center w-full h-8 bg-[#121212] p-2 rounded-[20px] cursor-pointer"
                                    onClick={() => router.push('/kelas')}
                                    aria-hidden>
                                    <HiOutlinePlusSm
                                        className="text-[#373737]"
                                        size={24}
                                    />
                                </div>
                            ) : (
                                <ListMyClass courses={data?.courses} />
                            )}
                        </>
                    )}
                </div>
            )}
            {loadingTransition && <LoadingBackdrop />}
        </div>
    );
};

const ListMyClass = ({
    courses
}: {
    courses?: StudentCourse[];
}): JSX.Element => {
    const router = useRouter();
    const tracker = useTracker();

    return (
        <div className="flex flex-col gap-3">
            {courses?.map(({ course_slug, course_name }) => (
                <div
                    key={course_slug}
                    className="w-full bg-[#121212] hover:bg-accent-purple py-2 px-4 rounded-[20px] cursor-pointer transition-all"
                    onClick={() => {
                        router.push(`/kelas/${course_slug}`);
                        tracker?.genericTrack('Click My Class Pill', {
                            'Course Slug': course_slug
                        });
                    }}
                    aria-hidden={true}>
                    <span className="text-sm font-body">{course_name}</span>
                </div>
            ))}
        </div>
    );
};

export default MyClass;
