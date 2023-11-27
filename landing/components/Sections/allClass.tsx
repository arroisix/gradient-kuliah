import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import useTransition from 'commons/hooks/useTransition';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { useTracker } from 'tracker/tracker';

const LIST_CLASS = [
    {
        cover: 'https://d2uqn6ndx4ow3t.cloudfront.net/lecturers/theo-profile.jpg',
        title: 'Kalkulus 1',
        description: 'Matematika dari perubahan.',
        slug: 'kalkulus1'
    },
    {
        cover: 'https://storage.googleapis.com/gradient-asset/courses/physics/fisika-thumbnail.jpg',
        title: 'Fisika Dasar 1',
        description: 'Mempelajari fenomena alam pada objek.',
        slug: 'fisdas1'
    },
    {
        cover: 'https://assets.gradient.academy/assets/lp-kimdas1.jpg',
        title: 'Kimia Dasar 1',
        description: 'Mengenal lebih dekat dengan atom dan unsur.',
        slug: 'kimdas1'
    },
    {
        cover: 'https://assets.gradient.academy/assets/lp-probstat.jpg',
        title: 'Probabilitas & Statistika',
        description: 'Mendeskripsikan dunia dengan data.',
        slug: 'probstat'
    },
    {
        cover: 'https://storage.googleapis.com/gradient-asset-dev/courses/calculus2/assets/kalkulus2-thumbnail.png',
        title: 'Kalkulus 2',
        description: 'Kalkulus di ruang berdimensi n.',
        slug: 'kalkulus2'
    },
    {
        cover: 'https://storage.googleapis.com/gradient-asset/courses/diffequation/assets/thumbnail_diffequation.jpg',
        title: 'Persamaan Diferensial',
        description: 'Aplikasi matematika di dunia nyata.',
        slug: 'persamaan-diferensial'
    },
    {
        cover: 'https://assets.gradient.academy/assets/lp-ptsl.png',
        title: 'Pengantar Teknik Sipil & Lingkungan',
        description: 'Ilmu membangun peradaban.',
        slug: 'ptsl'
    }
];

const AllClass = (): JSX.Element => {
    const [isHover, setIsHover] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const loadingTransition = useTransition(router);

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

    function handleMouseEnter(): void {
        setIsHover(true);
    }

    function handleMouseLeave(): void {
        setIsHover(false);
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
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
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
                <div
                    className={`absolute top-0 left-0 h-full px-5 ${
                        isHover ? 'block' : 'hidden'
                    }`}>
                    <div className="w-[50px] h-full absolute top-0 left-0 bg-gradient-to-r from-black to-transparent" />
                    <button className="h-full" onClick={scrollLeft}>
                        <FaChevronRight size={26} className="rotate-180" />
                    </button>
                </div>
                <div
                    className={`absolute top-0 right-0 h-full px-5 ${
                        isHover ? 'block' : 'hidden'
                    }`}>
                    <div className="w-[50px] h-full absolute top-0 right-0 bg-gradient-to-l from-black to-transparent" />
                    <button className="h-full" onClick={scrollRight}>
                        <FaChevronRight size={26} className="rotate-0" />
                    </button>
                </div>
            </div>
            {loadingTransition && <LoadingBackdrop />}
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
    const tracker = useTracker();

    return (
        <div
            className="relative w-fit snap-center bg-[#5F2BCE33] rounded-3xl overflow-hidden cursor-pointer"
            onClick={() => {
                tracker?.genericTrack('Click Class Card', {
                    'Course Slug': slug
                });
                router.push(`/kelas/${slug}`);
            }}
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
                <span className="inline-block w-full font-medium text-[#FFFFFF80] text-[10px] md:text-base whitespace-nowrap text-ellipsis overflow-hidden">
                    {description}
                </span>
            </div>
        </div>
    );
};

export default AllClass;
