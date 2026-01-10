import { useAuth } from 'authentication/contexts/AuthProvider';
import { useGetLearningProgressQuery } from 'courses/redux/api/learningExperienceApi';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface CourseMenuItemProps {
    course: Course;
    href: string;
}

function CourseMenuItem({ course, href }: CourseMenuItemProps): JSX.Element {
    const router = useRouter();
    const { slug_subtest } = router.query as { slug_subtest: string };

    const { isAuthenticated } = useAuth();
    const { isLoading: isLoadingProgress } = useGetLearningProgressQuery(
        course.slug,
        { skip: !isAuthenticated || !course.slug }
    );

    return (
        <Link
            href={href}
            className={`${
                (isAuthenticated && isLoadingProgress) || course.is_coming_soon
                    ? 'pointer-events-none'
                    : ''
            } ${
                course.slug === slug_subtest
                    ? 'bg-[#7D89CC]'
                    : 'bg-transparent hover:bg-[#2C2C2C]'
            } w-full rounded-lg p-3 flex justify-between items-center gap-4 transition-all duration-300`}>
            <div className="bg-[#333333] shrink-0 rounded-full p-2 flex">
                <Image
                    src={course.cover}
                    alt={course.course_name}
                    width={32}
                    height={32}
                    className="object-cover object-center"
                />
            </div>

            <div className="w-full space-y-1">
                <h5
                    className={`${
                        course.is_coming_soon ? 'text-[#999999]' : 'text-white'
                    } font-semibold text-base leading-[140%]`}>
                    {course.course_name}
                </h5>

                {course.tags && course.tags.length > 0 ? (
                    <p
                        className={`${
                            course.slug === slug_subtest
                                ? 'text-white'
                                : course.is_coming_soon
                                ? 'text-[#666666]'
                                : 'text-[#999999]'
                        } text-sm leading-[160%]`}>
                        {course.tags?.join(', ')}.
                    </p>
                ) : (
                    <></>
                )}
            </div>

            {course.is_coming_soon ? (
                <div
                    className={`${
                        course.is_coming_soon ? 'text-[#999999]' : 'text-white'
                    } bg-[#36236A] shrink-0 self-start font-bold text-[10px] px-2 py-1 rounded-lg`}>
                    COMING SOON
                </div>
            ) : (
                <></>
            )}
        </Link>
    );
}

export { CourseMenuItem };
