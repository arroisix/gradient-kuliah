import Link from 'next/link';
import Container from './Container';
import Button from 'commons/components/elements/Button';
import { BiChevronRight } from 'react-icons/bi';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { FEATURES } from 'landing/constants/Features';
import { MdOutlineChevronLeft, MdOutlineChevronRight } from 'react-icons/md';
import { useGrid } from 'courses/contexts/GridProvider';
import { useRef } from 'react';
import { cn } from 'commons/utils';
import { useTracker } from 'tracker/tracker';

const Features = (): JSX.Element => {
    const { cellWidth, gapWidth } = useGrid();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollTo = (direction: 'left' | 'right') => {
        const scrollWidth = cellWidth! + gapWidth!;
        const scrollAmount =
            direction === 'left' ? -scrollWidth! : scrollWidth!;
        scrollContainerRef.current?.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <Container className="flex flex-col gap-5 py-9 md:py-16" id="features">
            <div className="flex justify-between items-center">
                <h2 className="font-sans text-xl font-extrabold text-center md:text-left">
                    Pilih fitur yang sesuai sama cara belajarmu
                </h2>
                <div className="hidden md:flex gap-4 text-black">
                    <button
                        className="bg-white hover:bg-[#F8F8F8] duration-200 w-8 h-8 rounded-full flex justify-center items-center text-2xl"
                        onClick={() => scrollTo('left')}>
                        <MdOutlineChevronLeft size={24} />
                    </button>
                    <button
                        className="bg-white hover:bg-[#F8F8F8] duration-200 w-8 h-8 rounded-full flex justify-center items-center text-2xl"
                        onClick={() => scrollTo('right')}>
                        <MdOutlineChevronRight size={24} />
                    </button>
                </div>
            </div>
            <div
                ref={scrollContainerRef}
                className="course-progress flex gap-6 overflow-x-auto">
                {FEATURES.map(
                    ({ link, title, description, photoName, photoSize }) => (
                        <FeatureCard
                            key={`feature-${title
                                .toLowerCase()
                                .replace(' ', '-')}`}
                            link={link}
                            title={title}
                            description={description}
                            photoName={photoName}
                            photoSize={photoSize}
                        />
                    )
                )}
            </div>
        </Container>
    );
};

const FeatureCard = ({
    link,
    title,
    description,
    photoName,
    photoSize
}: LandingFeatureCardProps): JSX.Element => {
    const { cellRef } = useGrid();
    const tracker = useTracker();

    return (
        <Link
            href={link}
            onClick={() =>
                tracker?.genericTrack('Click Feature Card', { Feature: title })
            }>
            <div
                ref={cellRef}
                className="min-w-[275px] bg-[#272727] px-4 pt-4 rounded-xl flex flex-col gap-2 h-[270px] shadow-[0_6px_8px_0_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="font-sans font-bold text-xl">{title}</h3>
                    <Chevron />
                </div>
                <p className="font-body text-sm">{description}</p>
                <div
                    className={cn(
                        'absolute top-28',
                        photoSize === 'sm'
                            ? 'left-7 w-[219px]'
                            : 'left-4 w-[243px]'
                    )}>
                    <div
                        className={cn(
                            'relative',
                            photoSize === 'sm'
                                ? 'aspect-[2.75/2]'
                                : 'aspect-[3.5/2]'
                        )}>
                        <Image
                            src={`${CDN_URL}/assets/${photoName}.png`}
                            loading="lazy"
                            layout="fill"
                            alt={title}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};

const Chevron = (): JSX.Element => (
    <Button
        variant="primary"
        className="flex flex-none items-center w-9 h-9 !p-0 justify-center drop-shadow-[0_4px_5px_rgba(0,0,0,0.25)]">
        <BiChevronRight size={24} />
    </Button>
);

export default Features;
