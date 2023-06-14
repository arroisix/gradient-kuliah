import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import useTransition from 'commons/hooks/useTransition';
import { useRouter } from 'next/router';
import { AiOutlinePlus } from 'react-icons/ai';

const dummyData = {
    courses: [
        {
            course_slug: 'fisdas',
            course_name: 'Fisika Dasar'
        },
        {
            course_slug: 'kimdas1',
            course_name: 'Kimia Dasar 1'
        },
        {
            course_slug: 'kalkulus2',
            course_name: 'Kalkulus 2'
        }
    ]
};
// const dummyData = {
//     courses: []
// };

const MyClass = ({ className }: { className?: string }): JSX.Element => {
    return (
        <div className={`flex flex-col gap-3 md:gap-5 ${className}`}>
            <h4 className="text-lg font-extrabold">Kelasku</h4>
            <div>
                {dummyData?.courses.length === 0 ? (
                    <div className="w-full bg-[#121212] p-2 rounded-[20px]">
                        <AiOutlinePlus className="mx-auto text-[#373737]" />
                    </div>
                ) : (
                    <ListMyClass />
                )}
            </div>
        </div>
    );
};

const ListMyClass = (): JSX.Element => {
    const router = useRouter();
    const loadingTransition = useTransition(router);

    return (
        <div className="flex flex-col gap-3">
            {dummyData?.courses.map(({ course_slug, course_name }) => (
                <div
                    key={course_slug}
                    className="w-full bg-[#121212] hover:bg-accent-purple py-2 px-4 rounded-[20px] cursor-pointer transition-all"
                    onClick={() => router.push(`/kelas/${course_slug}`)}
                    aria-hidden={true}>
                    <span>{course_name}</span>
                </div>
            ))}
            {loadingTransition && <LoadingBackdrop />}
        </div>
    );
};

export default MyClass;
