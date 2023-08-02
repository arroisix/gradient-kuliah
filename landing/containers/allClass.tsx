import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { FaChevronRight } from 'react-icons/fa';

const LIST_CLASS = [
    {
        cover: 'https://assets.gradient.academy/assets/lp-probstat.jpg',
        title: 'Probabilitas & Statistika',
        description: 'Mendeskripsikan dunia dengan data.',
        slug: 'probstat'
    },
    {
        cover: 'https://d2uqn6ndx4ow3t.cloudfront.net/lecturers/theo-profile.jpg',
        title: 'Kalkulus 1',
        description: 'Matematika dari perubahan.',
        slug: 'kalkulus1'
    },
    {
        cover: 'https://assets.gradient.academy/assets/lp-ptsl.png',
        title: 'Pengantar Teknik Sipil & Lingkungan',
        description: 'Ilmu membangun peradaban.',
        slug: 'ptsl'
    },
    {
        cover: 'https://storage.googleapis.com/gradient-asset-dev/courses/calculus2/assets/kalkulus2-thumbnail.png',
        title: 'Kalkulus 2',
        description: 'Kalkulus di ruang berdimensi n.',
        slug: 'kalkulus2'
    },
    {
        cover: 'https://storage.googleapis.com/gradient-asset/courses/physics/fisika-thumbnail.jpg',
        title: 'Fisika Dasar 1',
        description: 'COPY_WRITING_FISDAS',
        slug: 'fisdas1'
    },
    {
        cover: 'https://storage.googleapis.com/gradient-asset/courses/diffequation/assets/thumbnail_diffequation.jpg',
        title: 'Persamaan Diferensial',
        description: 'COPY_WRITING_PERSAMAAN_DIFF',
        slug: 'persamaan-diferensial'
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
                    className="w-full overflow-x-scroll snap-x body scroll-smooth px-[18px] md:px-[32px]">
                    <div className="w-max mx-auto flex gap-[18px] md:gap-7">
                        {LIST_CLASS.map(
                            ({ cover, title, description, slug }, index) => (
                                <ClassCard
                                    key={index}
                                    cover={cover}
                                    title={title}
                                    description={description}
                                    slug={slug}
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
    description,
    slug
}: {
    cover: string;
    title: string;
    description: string;
    slug: string;
}): JSX.Element => {
    const router = useRouter();

    return (
        <div
            className="relative w-fit snap-center bg-[#5F2BCE33] rounded-3xl overflow-hidden cursor-pointer"
            onClick={() => router.push(`/kelas/${slug}`)}
            aria-hidden>
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

export default AllClass;
