import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import React from 'react';

const DashboardCard = (item: LearningMaterial): JSX.Element => {
    return (
        <div className="flex flex-col w-full border rounded-md">
            <div className="bg-[#242424] p-2.5 sm:h-[160px] h-[150px]">
                <Image
                    src={
                        item.thumbnail ||
                        `${CDN_URL}/assets/astronotes-kalkulus2-placeholder.jpg`
                    }
                    alt="Materi"
                    height={item.type !== 'Video' ? 256 : undefined}
                    width={item.type !== 'Video' ? 364 : undefined}
                    layout={item.type == 'Video' ? 'fill' : 'fixed'}
                    unoptimized
                />
            </div>
            <div className="flex flex-col gap-1 p-2">
                <p className="text-xs text-neutral-400">{item.type}</p>
                <p className="text-sm font-bold text-white">{item.title}</p>
            </div>
        </div>
    );
};

export default DashboardCard;
