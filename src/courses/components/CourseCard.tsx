import { useRouter } from 'next/router';

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
            onClick={() => router.push(`/kelas/${course.uuid}`)}
            aria-hidden={true}>
            {course.courseName}
            {course.isSubscribed && (
                <div
                    className="bg-accent-purple px-4 rounded-bl-lg py-1 absolute top-0 right-0 font-bold"
                    style={{
                        background:
                            'linear-gradient(267.57deg, #2A0085 47.97%, #5F2BCE 74.23%)'
                    }}>
                    Kelasku
                </div>
            )}
        </div>
    );
};

export default CourseCard;
