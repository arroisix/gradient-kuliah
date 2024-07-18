import React from 'react';
import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import Link from 'next/link';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { IoTime } from 'react-icons/io5';
import { TbCircleCheckFilled } from 'react-icons/tb';
import { useTracker } from 'tracker/tracker';
import Image from 'next/image';
import { BiSolidStar } from 'react-icons/bi';

const HorizontalProductCard = ({
    href,
    className,
    imageClassname,
    heading,
    category,
    eventName,
    eventPayload,
    product
}: Omit<ProductCardProps, 'orientation'>): JSX.Element => {
    const tracker = useTracker();
    const TitleLabel = heading ?? 'p';

    return (
        <Link
            href={href}
            onClick={() => tracker?.genericTrack(eventName, eventPayload)}
            className={cn(
                'flex gap-4 p-3 bg-graphite-800 border rounded-lg border-graphite-600/50 shadow-md shadow-black/25',
                className
            )}>
            <div className={cn('grid flex-none h-full place-items-center')}>
                <div
                    className={cn(
                        'relative border rounded-md border-neutral-700',
                        category !== 'Video'
                            ? 'aspect-[256/364]'
                            : 'aspect-[4/3]',
                        imageClassname
                    )}>
                    <Image
                        src={
                            product.thumbnail ??
                            `${CDN_URL}/assets/astronotes-kalkulus2-placeholder.jpg`
                        }
                        alt={product.title ?? 'thumbnail'}
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                    />
                    {category === 'Video' && (
                        <div className="absolute inset-0 grid place-items-center">
                            <div className="text-white border-none btn btn-sm btn-circle bg-graphite-900/60">
                                <FaRegCirclePlay size={24} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col w-full overflow-hidden font-body grow">
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
                            <IoTime size={12} className="mr-1" /> In Progress -{' '}
                            {product.latestProgress}%
                        </>
                    )}
                </p>

                <TitleLabel className="font-sans text-sm font-bold text-balance line-clamp-2">
                    {product.title}
                </TitleLabel>
                {product.inProgress ? (
                    <Progress product={product} />
                ) : (
                    <Info product={product} />
                )}
                <div
                    className={cn(
                        'rounded-full text-xs w-fit text-white font-semibold px-3 py-1 bg-neutral-700',
                        {
                            'bg-[#00B78B]': category === 'Textbook',
                            'bg-[#CC009E]':
                                category === 'Catatan' ||
                                category === 'Astronotes',
                            'bg-[#0083FF]': category === 'Bank Soal'
                        }
                    )}>
                    {category}
                </div>
            </div>
        </Link>
    );
};

const Info = ({ product }: { product: Product }): JSX.Element => {
    const authors = product?.authors ?? [];

    return (
        <>
            <p
                className={cn(
                    'w-full mt-1 text-xs truncate',
                    authors.length === 0 && 'hidden'
                )}>
                {product.authors?.map((author, index) => (
                    <React.Fragment key={index}>
                        {author.trim()}
                        {index < authors.length - 1 && ', '}
                    </React.Fragment>
                ))}
            </p>
            <p
                className={cn(
                    'mt-2 text-accent-yellow text-xs font-bold flex gap-1',
                    !product.rating && 'hidden'
                )}>
                <BiSolidStar size={16} />
                {product.rating && product.rating.toFixed(1)}
            </p>
            <div className="grow min-h-2"></div>
        </>
    );
};

const Progress = ({ product }: { product: Product }): JSX.Element => (
    <>
        <p
            className={cn(
                'pt-2 font-sans text-xs text-neutral-200 line-clamp-1',
                !product.latestChapter ||
                    (product.latestProgress == 100 && 'hidden')
            )}>
            {product.latestChapter}
        </p>
        <div className="grow min-h-2"></div>
    </>
);

export default HorizontalProductCard;
