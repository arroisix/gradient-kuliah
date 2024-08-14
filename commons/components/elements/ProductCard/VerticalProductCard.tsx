import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { IoTime } from 'react-icons/io5';
import { TbCircleCheckFilled } from 'react-icons/tb';
import { useTracker } from 'tracker/tracker';

const VerticalProductCard = ({
    href,
    category,
    product,
    heading,
    eventName,
    eventPayload,
    className,
    imageClassname
}: Omit<ProductCardProps, 'orientation'>): JSX.Element => {
    const tracker = useTracker();
    const isVideo = category.toLowerCase() == 'video';
    const isCourse = category.toLowerCase() == 'kelas';
    const TitleLabel = heading ?? 'p';

    return (
        <Link
            href={href}
            onClick={() => tracker?.genericTrack(eventName, eventPayload)}
            className={cn(
                'relative flex flex-col items-end overflow-hidden rounded-lg cursor-pointer bg-neutral-800 border border-graphite-600/50',
                className
            )}>
            <div
                className={cn(
                    'w-full grid place-items-center',
                    isCourse || isVideo ? 'aspect-[2/1]' : 'aspect-[4/3]',
                    !(isVideo || isCourse) && 'py-2'
                )}>
                <div
                    className={cn(
                        'relative rounded-md border-neutral-700 object-center',
                        !(isVideo || isCourse)
                            ? 'aspect-[256/364] h-full shadow-lg border'
                            : 'h-full w-full',
                        imageClassname
                    )}>
                    <Image
                        src={
                            product.thumbnail ??
                            `${CDN_URL}/assets/astronotes-kalkulus2-placeholder.jpg`
                        }
                        alt={product.title ?? 'thumbnail'}
                        layout="fill"
                        objectPosition="center"
                        objectFit="cover"
                        className="rounded"
                    />
                    {(isVideo ||
                        (category.toLowerCase() == 'kelas' &&
                            product.inProgress)) && (
                        <div className="absolute inset-0 grid place-items-center">
                            <div className="text-white border-none btn btn-circle bg-graphite-900/60">
                                <FaRegCirclePlay size={32} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col w-full gap-1 px-3 py-3 lg:px-4 grow bg-graphite-900">
                <p
                    className={cn(
                        !product.inProgress ? 'hidden' : 'flex',
                        'items-center text-xs mb-2',
                        product.latestProgress == 100
                            ? 'text-[#282b29]'
                            : 'text-accent-yellow items-center pl-1 pr-2 py-0.5 font-medium rounded bg-accent-yellow/25 w-max'
                    )}>
                    {product.latestProgress == 100 ? (
                        <>
                            <TbCircleCheckFilled size={12} className="mr-1" />
                            Completed
                        </>
                    ) : (
                        <>
                            <IoTime size={12} className="mr-1" /> In Progress{' '}
                            {product.latestProgress !== 0 && (
                                <span className="ml-1">
                                    - {product.latestProgress}%
                                </span>
                            )}
                        </>
                    )}
                </p>
                <div
                    className={cn(
                        (isVideo || isCourse) && 'hidden',
                        product.inProgress && 'hidden',
                        'rounded-full text-xs w-fit text-white font-semibold px-3 py-1 bg-neutral-700',
                        {
                            'bg-[#00B78B]': category.includes('Textbook'),
                            'bg-[#CC009E]':
                                category === 'Catatan' ||
                                category === 'Astronotes',
                            'bg-[#0083FF]': category === 'Bank Soal'
                        }
                    )}>
                    {category}
                </div>
                <p className={cn(!product?.courseName && 'hidden', 'text-xs')}>
                    {product?.courseName}
                </p>
                <TitleLabel
                    className={cn(
                        'text-sm grow font-bold line-clamp-2 text-balance'
                    )}>
                    {product.title}
                </TitleLabel>
                {product.latestChapter && (
                    <p className="text-xs text-graphite-100 line-clamp-2 text-balance">
                        Bab: {product.latestChapter}
                    </p>
                )}
            </div>
            <div
                className={cn(
                    'rounded-full px-3 py-1 w-max bg-gradient-to-r from-[#F2C04C] via-[#E48E0D] to-[#E4B50D] font-bold text-white text-xs',
                    !product.isComingSoon && 'hidden'
                )}>
                Segera Hadir
            </div>
            {!product.isComingSoon && product.isNew && (
                <div className="bg-[#E9202A] px-4 rounded-full py-1 absolute top-4 left-4 font-bold">
                    Baru
                </div>
            )}
        </Link>
    );
};

export default VerticalProductCard;
