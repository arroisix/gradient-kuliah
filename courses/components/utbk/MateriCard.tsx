import Image from 'next/image';
import Link from 'next/link';
import { IoMdTime } from 'react-icons/io';

interface MateriCardProps
    extends Pick<
        Course,
        | 'course_name'
        | 'cover'
        | 'tags'
        | 'latest_subchapter_name'
        | 'percentage_progress'
        | 'is_coming_soon'
    > {
    href: string;
    isOpenNewTab?: boolean;
}

function MateriCard({
    course_name,
    cover,
    tags,
    latest_subchapter_name,
    percentage_progress,
    href,
    is_coming_soon,
    isOpenNewTab = false
}: MateriCardProps): JSX.Element {
    const progress = Math.min(
        Math.max(((percentage_progress ?? 0) / 100) * 100, 0),
        100
    );

    return (
        <Link
            href={href}
            target={isOpenNewTab ? '_blank' : '_self'}
            rel={isOpenNewTab ? 'noopener noreferrer' : ''}
            className={`${
                is_coming_soon ? 'pointer-events-none' : ''
            } bg-[#222222] hover:bg-[#2C2C2C] transition-all duration-300 w-full rounded-lg p-4 flex gap-4 items-center`}>
            <div className="bg-[#333333] rounded-full p-2 flex">
                <Image
                    src={cover}
                    alt={course_name}
                    width={32}
                    height={32}
                    className="object-cover object-center"
                />
            </div>

            <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                    <h2
                        className={`${
                            is_coming_soon ? 'text-[#999999]' : 'text-white'
                        } font-semibold text-sm`}>
                        {course_name}
                    </h2>

                    {percentage_progress ? (
                        <span
                            className={`${
                                percentage_progress === 100
                                    ? 'text-[#03AC5C]'
                                    : 'text-[#B6A6F3]'
                            } font-semibold`}>
                            {percentage_progress}%
                        </span>
                    ) : is_coming_soon ? (
                        <></>
                    ) : (
                        <span className="text-[#999999] font-semibold">0%</span>
                    )}
                </div>

                {tags && tags.length > 0 ? (
                    <p
                        className={`${
                            is_coming_soon ? 'text-[#666666]' : 'text-[#999999]'
                        } text-sm mb-2`}>
                        {tags.join(', ')}.
                    </p>
                ) : (
                    <></>
                )}

                {is_coming_soon ? (
                    <div
                        className={`${
                            is_coming_soon ? 'text-[#999999]' : 'text-white'
                        } bg-[#36236A] w-fit font-bold text-[10px] px-2 py-1 rounded-lg`}>
                        COMING SOON
                    </div>
                ) : (
                    <div className="bg-[#4B4E5F] rounded-full overflow-hidden w-full h-2 mt-2 mb-4">
                        <div
                            className="bg-[#B6A6F3] rounded-full transition-all duration-500 ease-out h-full"
                            style={{ width: `${progress}%` }}
                            role="progressbar"
                            aria-valuenow={percentage_progress ?? 0}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                )}

                {!is_coming_soon && latest_subchapter_name ? (
                    <p
                        className={`${
                            percentage_progress
                                ? 'text-white'
                                : 'text-[#999999]'
                        } text-sm flex items-center gap-2`}>
                        {percentage_progress && percentage_progress < 100 ? (
                            <IoMdTime className="text-white w-4 h-4" />
                        ) : (
                            <></>
                        )}

                        {percentage_progress
                            ? percentage_progress === 100
                                ? 'Selesai'
                                : latest_subchapter_name
                            : 'Belum dimulai'}
                    </p>
                ) : (
                    <></>
                )}
            </div>
        </Link>
    );
}

export { MateriCard };
