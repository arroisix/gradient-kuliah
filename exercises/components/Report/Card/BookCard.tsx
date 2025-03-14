import React from 'react';
import { RecommendedMaterial } from '../../../types/exercises';
import Image from 'next/image';
import { BiSolidStar } from 'react-icons/bi';

export const BookCard: React.FC<{ material: RecommendedMaterial }> = ({
    material
}) => (
    <>
        <div className="relative w-[108px] h-40 flex-shrink-0">
            <Image
                src={material.thumbnail}
                alt={material.name}
                layout="fill"
                objectFit="cover"
            />
        </div>
        <div className="p-3 flex flex-col justify-between items-start flex-grow">
            <h4 className="text-white text-sm font-medium line-clamp-2">
                {material.name}
            </h4>
            <div className="flex items-center mt-1">
                <BiSolidStar className="text-yellow-400 mr-1" />
                <span className="text-white text-xs">
                    {material.rating?.toFixed(1)}
                </span>
            </div>
            <div className="mt-2">
                <span
                    className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${
                        material.book_type === 'bank-soal'
                            ? 'bg-[#0083FF]'
                            : 'bg-[#CC009E]'
                    }`}>
                    {material.book_type === 'bank-soal'
                        ? 'Bank Soal'
                        : 'Astronotes'}
                </span>
            </div>
        </div>
    </>
);
