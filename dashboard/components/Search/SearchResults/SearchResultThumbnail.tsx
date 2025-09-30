import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import React from 'react';
import { FaRegCirclePlay } from 'react-icons/fa6';

const SearchResultThumbnail = ({
    type,
    thumbnail,
    title,
    duration
}: SearchResultCardProps): JSX.Element => {
    switch (type) {
        case 'course_video':
            return thumbnail ? (
                <>
                    <Image
                        src={thumbnail}
                        layout="fill"
                        className="object-cover rounded-t-lg md:rounded-tr-none md:rounded-bl-lg"
                        alt={title}
                    />
                    <div className="absolute inset-0 grid place-items-center">
                        <div className="text-white border-none btn btn-circle bg-graphite-900/60">
                            <FaRegCirclePlay size={32} />
                        </div>
                    </div>
                    <div className="absolute px-2 py-1 text-xs font-medium rounded right-2 bottom-2 bg-black/50">
                        {duration}
                    </div>
                </>
            ) : (
                <></>
            );
        case 'astronotes_content':
        case 'bank_soal_problem':
        case 'textbook_problem':
            return (
                <div className="grid w-full h-full p-4 md:px-6 md:py-0 lg:px-12 place-items-center bg-[#333]">
                    <div className="aspect-[256/364] relative min-w-16 h-full md:h-auto md:w-16">
                        {thumbnail && (
                            <Image
                                src={thumbnail}
                                layout="fill"
                                className="object-cover border rounded-lg shadow-lg"
                                alt={title}
                            />
                        )}
                    </div>
                </div>
            );

        case 'community_post':
            return (
                <div className="grid w-full h-full p-4 place-items-center bg-[#333] relative md:p-8">
                    <Image
                        src={thumbnail || `${CDN_URL}/assets/discussion.png`}
                        height={72 * 2}
                        width={108 * 2}
                        alt="Diskusi"
                        className="rounded-lg"
                    />
                </div>
            );

        default:
            return <></>;
    }
};

export default SearchResultThumbnail;
