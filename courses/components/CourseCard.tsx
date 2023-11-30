import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import useTransition from 'commons/hooks/useTransition';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const CourseCard = ({
    course,
    onClick
}: {
    course: Course;
    onClick?: () => void;
}): JSX.Element => {
    const router = useRouter();
    const loadingTransition = useTransition(router);

    useEffect(() => {
        if (course && !course.is_only_notebook)
            router.prefetch(`/kelas/${course.slug}`);
    }, [course]);

    const decideUrl = (): string => {
        if (course.is_only_notebook) {
            return `/kelas/${course.slug}/astronotes`;
        }

        return `/kelas/${course.slug}`;
    };

    return (
        <Link href={decideUrl()} onClick={() => onClick?.()}>
            <div
                className="relative flex items-end w-full p-4 mr-2 overflow-hidden rounded-lg cursor-pointer h-52 bg-neutral-800"
                style={{
                    background: `url(${course.thumbnail})`,
                    backgroundColor: '#333333',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                {course.course_name}
                {course.is_coming_soon && (
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
            {loadingTransition && <LoadingBackdrop />}
        </Link>
    );
};

export default CourseCard;
