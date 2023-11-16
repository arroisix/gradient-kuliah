import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { useTracker } from 'tracker/tracker';
type ClassCardProps = {
    cover: string;
    title: string;
    slug: string;
};
const ClassCard = ({ cover, title, slug }: ClassCardProps): JSX.Element => {
    const tracker = useTracker();

    return (
        <Link
            className="relative bg-[#5F2BCE33] rounded-xl overflow-hidden cursor-pointer"
            href={`/kelas/${slug}`}
            onClick={() =>
                tracker?.genericTrack('Click Class Card', {
                    'Course Slug': slug
                })
            }
            aria-hidden>
            <div className="relative w-full aspect-[4/3]">
                <Image
                    src={cover}
                    loading="lazy"
                    layout="fill"
                    className="object-cover object-top"
                />
            </div>
            <div className="flex items-center justify-between gap-4 p-3">
                <p className="text-xs font-extrabold lg:overflow-hidden lg:whitespace-nowrap lg:text-ellipsis lg:text-base">
                    {title}
                </p>
                <FaChevronRight size={10} className="text-[#FFFFFF33]" />
            </div>
        </Link>
    );
};

export default ClassCard;
