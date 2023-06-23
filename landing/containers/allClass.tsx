import Image from 'next/image';
import { useRef } from 'react';
import { FaChevronRight } from 'react-icons/fa';

const LIST_CLASS = [
    {
        cover: 'https://assets.gradient.academy/assets/lp-probstat.jpg',
        title: 'Probabilitas & Statistika',
        description: 'Kuantifikasi perubahan'
    },
    {
        cover: 'https://d2uqn6ndx4ow3t.cloudfront.net/lecturers/theo-profile.jpg',
        title: 'Kalkulus 1',
        description: 'Kuantifikasi perubahan'
    },
    {
        cover: 'https://assets.gradient.academy/assets/lp-ptsl.png',
        title: 'Pengantar Teknik Sipil & Lingkungan',
        description: 'Kuantifikasi perubahan'
    }
];

const AllClass = (): JSX.Element => {
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
        <section className="flex flex-col gap-8 md:gap-10">
            <div className="text-center px-[18px]">
                <h2 className="font-extrabold text-xl md:text-4xl">
                    Belajar dari pengajar terbaik bangsa.
                </h2>
                <span className="inline-block pt-[10px] md:pt-[18px] text-[#999999] md:text-2xl">
                    Pilih mata kuliah yang kamu minati.
                </span>
            </div>
            <div className="relative group">
                <div
                    ref={ref}
                    className="w-full overflow-x-scroll snap-x body scroll-smooth px-[18px]">
                    <div className="w-max mx-auto flex gap-[18px] md:gap-7">
                        {LIST_CLASS.map(
                            ({ cover, title, description }, index) => (
                                <ClassCard
                                    key={index}
                                    cover={cover}
                                    title={title}
                                    description={description}
                                />
                            )
                        )}
                    </div>
                </div>
                <div className="absolute top-0 h-full justify-between w-full hidden group-hover:flex px-5">
                    <button className="h-full z-[1]" onClick={scrollLeft}>
                        <FaChevronRight size={26} className="rotate-180" />
                    </button>
                    <div className="w-[50px] h-full absolute left-0 bg-gradient-to-r from-black to-transparent"></div>
                    <button className="h-full z-[1]" onClick={scrollRight}>
                        <FaChevronRight size={26} />
                    </button>
                    <div className="w-[50px] h-full absolute right-0 bg-gradient-to-l from-black to-transparent"></div>
                </div>
            </div>
        </section>
    );
};

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
                    <span className="inline-block font-extrabold text-xs md:text-lg">
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

export default AllClass;
