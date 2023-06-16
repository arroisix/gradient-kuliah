import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import useTransition from 'commons/hooks/useTransition';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetStudentCourseQuery } from 'dashboard/redux/api/dashboardApi';
import { useRouter } from 'next/router';
import { HiOutlinePlusSm } from 'react-icons/hi';

const MyClass = ({ className }: { className?: string }): JSX.Element => {
    const router = useRouter();
    const loadingTransition = useTransition(router);

    const { data, isLoading } = useGetStudentCourseQuery();
    const { is_subscribed } = useCourseSubscription();

    return (
        <div className={`flex flex-col gap-3 md:gap-5 ${className}`}>
            <h4 className="text-lg font-extrabold">Kelasku</h4>
            <div>
                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        <div className="w-full h-8 py-2 px-4 rounded-[20px] bg-neutral-800 text-neutral-800 animate-pulse"></div>
                        <div className="w-full h-8 py-2 px-4 rounded-[20px] bg-neutral-800 text-neutral-800 animate-pulse"></div>
                        <div className="w-full h-8 py-2 px-4 rounded-[20px] bg-neutral-800 text-neutral-800 animate-pulse"></div>
                    </div>
                ) : (
                    <>
                        {!is_subscribed ? (
                            <div
                                className="w-full bg-accent-purple p-2 rounded-[20px] text-center font-extrabold cursor-pointer"
                                onClick={() => router.push('/langganan')}
                                aria-hidden>
                                <span>Akses Kelas</span>
                            </div>
                        ) : data?.courses.length === 0 ? (
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

    return (
        <div className="flex flex-col gap-3">
            {courses?.map(({ course_slug, course_name }) => (
                <div
                    key={course_slug}
                    className="w-full bg-[#121212] hover:bg-accent-purple py-2 px-4 rounded-[20px] cursor-pointer transition-all"
                    onClick={() => router.push(`/kelas/${course_slug}`)}
                    aria-hidden={true}>
                    <span className="font-body text-sm">{course_name}</span>
                </div>
            ))}
        </div>
    );
};

export default MyClass;
