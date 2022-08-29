import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const CourseCard = ({ course }: { course: Course }): JSX.Element => {
    const router = useRouter();

    return (
        <div
            className="p-4 h-52 w-full bg-neutral-800 mr-2 rounded-lg cursor-pointer flex items-end relative overflow-hidden"
            style={{
                background: `url(${course.thumbnail})`,
                backgroundColor: '#333333',
                backgroundSize: 'cover'
            }}
            onClick={
                course.comingSoon
                    ? () =>
                          toast.info('Segera hadir!', {
                              position: 'top-center',
                              theme: 'colored',
                              hideProgressBar: true
                          })
                    : () => router.push(`/kelas/${course.slug}`)
            }
            aria-hidden={true}>
            {course.course_name}
            {course.is_subscribed && (
                <div
                    className="bg-accent-purple px-4 rounded-bl-lg py-1 absolute top-0 right-0 font-bold"
                    style={{
                        background:
                            'linear-gradient(267.57deg, #2A0085 47.97%, #5F2BCE 74.23%)'
                    }}>
                    Kelasku
                </div>
            )}
            {course.comingSoon && (
                <div
                    className="bg-[#ECD402] px-4 rounded-bl-lg py-1 absolute top-0 right-0 font-bold"
                    style={{
                        background:
                            'linear-gradient(51.63deg, #ECD402 0%, #F03C15 96.9%)'
                    }}>
                    Segera hadir
                </div>
            )}
        </div>
    );
};

export default CourseCard;
