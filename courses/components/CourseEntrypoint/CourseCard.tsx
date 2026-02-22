import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import Link from 'next/link';
import Button from 'commons/components/elements/Button';

interface CourseCardProps extends CourseV3 {
    highlightQuery?: string;
}

const CourseCard = ({
    course_name,
    thumbnail,
    is_free,
    lecturers,
    slug,
    latest_subchapter_slug,
    highlightQuery
}: CourseCardProps): JSX.Element => {
    const hasMultipleLecturers = lecturers.length > 1;

    const renderHighlightedCourseName = (): JSX.Element | string => {
        const keyword = highlightQuery?.trim();

        if (!keyword) return course_name;

        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const matcher = new RegExp(`(${escapedKeyword})`, 'ig');

        if (!matcher.test(course_name)) {
            return course_name;
        }

        matcher.lastIndex = 0;

        return (
            <>
                {course_name.split(matcher).map((part, index) => {
                    const isMatch = part.toLowerCase() === keyword.toLowerCase();

                    return (
                        <span
                            key={`${part}-${index}`}
                            className={isMatch ? 'text-[#F2C04C]' : undefined}>
                            {part}
                        </span>
                    );
                })}
            </>
        );
    };

    return (
        <Link className="group w-full relative z-10" href={latest_subchapter_slug ? `/kelas/${slug}/${latest_subchapter_slug}` : `/kelas/${slug}`}>
            <div className='w-full rounded-lg border-1 overflow-hidden relative'>
                <div className='w-full aspect-[22/30]'>
                    <Image
                        src={thumbnail ? thumbnail : `${CDN_URL}/assets/course-entrypoint-default-thumbnail.png`}
                        alt="Course Card Placeholder"
                        layout="fill"
                        objectFit="cover"
                        className='transition-all duration-300 ease-out group-hover:scale-110 group-hover:blur-[2px]'
                    />
                </div>

                <div className='absolute inset-0 px-4 pb-4 pt-6 w-full h-full flex flex-col justify-end bg-[linear-gradient(180deg,rgba(16,16,16,0)_1.1%,rgba(16,16,16,0.44)_42.47%,rgba(16,16,16,0.7)_100%)]'>
                    <div className='transition-all duration-400 ease-out group-hover:pb-16'>
                        <h2 className='font-semibold text-sm line-clamp-2 text-white'>
                            {renderHighlightedCourseName()}
                        </h2>

                        {hasMultipleLecturers ? (
                            <div className='mt-4 flex flex-row items-center justify-between gap-3'>
                                <div className='flex -space-x-2 isolate'>
                                    {lecturers.slice(0, 3).map((lecturer, index) => (
                                        <div
                                            key={lecturer.id}
                                            className='w-8 h-8 rounded-full border border-[#4B4E5F] overflow-hidden relative shrink-0'
                                            style={{ zIndex: lecturers.length - index }}>
                                            <Image
                                                src={lecturer.photo}
                                                alt={lecturer.name}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className='px-3 py-1 rounded-[50px] bg-[linear-gradient(180deg,_rgba(0,0,0,0.4)_4.33%,_rgba(0,0,0,0.6)_100%)]'>
                                    <h3 className='text-xs font-semibold text-white whitespace-nowrap'>
                                        {lecturers.length} Pengajar
                                    </h3>
                                </div>
                            </div>
                        ) : (
                            <h3 className='text-sm mt-4 text-[#DEDEDE]'>
                                {lecturers.map((lecturer) => lecturer.name).join(', ')}
                            </h3>
                        )}
                    </div>

                    <div className='absolute left-4 right-4 bottom-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out'>
                        <Button
                            type='button'
                            variant='primary'
                            size='small'
                            className='w-full !backdrop-blur-sm'>
                            Mulai Belajar
                        </Button>
                    </div>
                </div>
            </div>

            {is_free && (
                <div className='absolute top-[-16px] right-[-16px] px-2 py-1 rounded-3xl bg-gradient-to-b from-[#014625] to-[rgba(3,172,92,0.9)]'>
                    <span className='text-xs font-semibold leading-[125%] tracking-[0.08em] align-middle text-white'>GRATIS</span>
                </div>
            )}
        </Link>
    )
}

export default CourseCard;