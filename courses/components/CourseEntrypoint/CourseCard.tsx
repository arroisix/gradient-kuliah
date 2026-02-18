import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import Link from 'next/link';
import Button from 'commons/components/elements/Button';

const CourseCard = ({
    course_name,
    thumbnail,
    is_free,
    lecturers,
    slug,
    latest_subchapter_slug
}: CourseV3): JSX.Element => {
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
                        <h2 className='font-semibold text-sm line-clamp-2'>{course_name}</h2>
                        <h3 className='text-sm mt-4'>{lecturers.map((lecturer) => lecturer.name).join(', ')}</h3>
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
                <div className='absolute top-[-16px] right-[-16px] px-2 py-1 rounded-3xl border-[2px] border-[#82A58A33] bg-[linear-gradient(360deg,rgba(3,172,92,0.288)_0%,rgba(1,70,37,0.32)_100%)]'>
                    <span className='text-xs font-semibold leading-[125%] tracking-[0.08em] align-middle'>GRATIS</span>
                </div>
            )}
        </Link>
    )
}

export default CourseCard;