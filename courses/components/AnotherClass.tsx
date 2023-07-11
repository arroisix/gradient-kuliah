import Image from 'next/image';
import { useRef } from 'react';
import { FaChevronRight } from 'react-icons/fa';

const LIST_CLASS = [
    {
        cover: 'https://assets.gradient.academy/assets/lp-probstat.jpg',
        title: 'Probabilitas & Statistika',
        description: 'Mendeskripsikan dunia dengan data.'
    },
    {
        cover: 'https://d2uqn6ndx4ow3t.cloudfront.net/lecturers/theo-profile.jpg',
        title: 'Kalkulus 1',
        description: 'Matematika dari perubahan.'
    },
    {
        cover: 'https://assets.gradient.academy/assets/lp-ptsl.png',
        title: 'Pengantar Teknik Sipil & Lingkungan',
        description: 'Ilmu membangun peradaban.'
    },
    {
        cover: 'https://storage.googleapis.com/gradient-asset-dev/courses/calculus2/assets/kalkulus2-thumbnail.png',
        title: 'Kalkulus 2',
        description: 'Kalkulus di ruang berdimensi n.'
    }
];

const ClassCard = ({
    cover,
    title,
    description
}: {
    cover: string;
    title: string;
    description: string;
}): JSX.Element => {
    return (
        <div className="relative w-fit snap-center bg-[#5F2BCE33] rounded-3xl overflow-hidden">
            <div className="relative w-[208px] h-[142px] md:h-[225px] md:w-[330px]">
                <Image
                    src={cover}
                    loading="lazy"
                    sizes="none"
                    layout="fill"
                    className="object-cover object-top"
                />
            </div>
            <div className="w-[200px] md:w-[330px] px-[18px] py-2 md:py-[14px]">
                <div className="flex items-center gap-1">
                    <span className="inline-block font-extrabold text-xs md:text-lg whitespace-nowrap text-ellipsis overflow-hidden">
                        {title}
                    </span>
                    <FaChevronRight size={10} className="text-[#FFFFFF33]" />
                </div>
                <span className="inline-block font-medium text-[#FFFFFF80] text-[10px] md:text-base">
                    {description}
                </span>
            </div>
        </div>
    );
};

const AnotherClass = (): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);

    function scrollRight(): void {
        const SCROLL_CONSTANT = 200;
        if (ref?.current) {
            ref.current.scrollLeft += SCROLL_CONSTANT;
        }
    }

    function scrollLeft(): void {
        const SCROLL_CONSTANT = 200;
        if (ref?.current) {
            ref.current.scrollLeft -= SCROLL_CONSTANT;
        }
    }

    return (
        <div className="flex flex-col gap-5 md:gap-6">
            <div className="flex justify-between items-center px-5 md:px-16">
                <span className="inline-block font-extrabold text-sm md:text-lg">
                    Kelas Lainnya
                </span>
                <div className="hidden md:flex gap-3">
                    <FaChevronRight
                        size={20}
                        onClick={scrollLeft}
                        className="text-neutral-500 hover:text-white rotate-180 cursor-pointer transition-all"
                    />
                    <FaChevronRight
                        size={20}
                        onClick={scrollRight}
                        className="text-neutral-500 hover:text-white cursor-pointer transition-all"
                    />
                </div>
            </div>
            <div
                ref={ref}
                className="w-full overflow-x-scroll snap-x body scroll-smooth px-5 md:px-16">
                <div className="w-max mx-auto flex gap-[18px] md:gap-7">
                    {LIST_CLASS.map(({ cover, title, description }, index) => (
                        <ClassCard
                            key={index}
                            cover={cover}
                            title={title}
                            description={description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnotherClass;
