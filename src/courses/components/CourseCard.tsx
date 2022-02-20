import { useRouter } from 'next/router';

const CourseCard = ({ course }: { course: Course }): JSX.Element => {
    const router = useRouter();

    return (
        <div
            className="p-4 h-52 bg-neutral-800 mr-2 rounded-lg cursor-pointer flex items-end"
            style={{
                background: `url(${course.thumbnail})`,
                backgroundColor: '#333333',
                backgroundSize: 'cover'
            }}
            onClick={() => router.push(`/kelas/${course.uuid}`)}
            aria-hidden={true}>
            {course.courseName}
        </div>
    );
};

export default CourseCard;
