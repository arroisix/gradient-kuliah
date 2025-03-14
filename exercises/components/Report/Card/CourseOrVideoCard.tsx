import React from 'react';
import { RecommendedMaterial } from '../../../types/exercises';
import Image from 'next/image';
import { FaRegCirclePlay } from 'react-icons/fa6';

export const CourseOrVideoCard: React.FC<{ material: RecommendedMaterial }> = ({
    material
}) => (
    <div className="flex flex-col w-full">
        <div className="relative w-full h-[108px]">
            <Image
                src={material.thumbnail}
                alt={material.name}
                layout="fill"
                objectFit="cover"
            />
            {material.type === 'Video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <FaRegCirclePlay className="text-white text-3xl" />
                </div>
            )}
        </div>
        <div className="p-3 flex-grow">
            <h4 className="text-white text-sm font-medium line-clamp-1 text-left">
                {material.name}
            </h4>
        </div>
    </div>
);
