import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { useTracker } from 'tracker/tracker';

const AstronoteBook = ({
    slug,
    book_cover_url,
    title,
    authors,
    rating,
    education_level,
    in_progress,
    eventName = 'Click Book Item on Library Page',
    eventPayload
}: Astronote & {
    eventName?: string;
    eventPayload?: Record<string, unknown>;
}): JSX.Element => {
    const tracker = useTracker();
    const router = useRouter();

    return (
        <div
            className="flex flex-col h-full cursor-pointer"
            onClick={() => {
                tracker?.genericTrack(eventName, {
                    'Book Slug': slug,
                    ...eventPayload
                });
                
                if (in_progress) router.push(`/astronotes/${slug}/1`);
                else router.push(`/astronotes/${slug}`);
            }}
            aria-hidden>
            <div className="aspect-[256/364] relative w-full border rounded border-neutral-700">
                <Image
                    src={
                        book_cover_url ||
                        'https://assets.gradient.academy/assets/astronotes-kalkulus2-placeholder.jpg'
                    }
                    layout="fill"
                    className="rounded"
                />
            </div>
            <div className="flex flex-col flex-1 mt-4 mb-2">
                <p className="font-body text-neutral-200">{title}</p>
                <div className="space-y-1">
                    {authors && (
                        <span className="text-sm font-body text-neutral-600">
                            {`oleh ${authors}`}
                        </span>
                    )}
                    {rating > 0 && (
                        <span className="flex items-center gap-[2px] font-body text-xs text-neutral-600 leading-2">
                            <AiFillStar />
                            {rating.toFixed(1)}
                        </span>
                    )}
                </div>
            </div>
            {education_level && (
                <div className="h-auto gap-1 py-1 text-sm font-medium font-body badge badge-primary bg-accent-purple">
                    <HiOutlineAcademicCap size={20} /> {education_level}
                </div>
            )}
        </div>
    );
};

export default AstronoteBook;
