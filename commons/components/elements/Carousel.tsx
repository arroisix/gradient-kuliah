import { useState } from 'react';
import Image from 'next/image';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface CarouselProps {
    images: {
        src: string;
        alt: string;
        width: number;
        height: number;
    }[];
    href?: string;
    target?: string;
    rel?: string;
}

const Carousel = ({
    images,
    href,
    target,
    rel
}: CarouselProps): JSX.Element => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const CarouselContent = () => (
        <div className="relative aspect-[1080/1350] overflow-hidden">
            {/* Images */}
            <div
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {images.map((image, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0">
                        <Image
                            src={image.src}
                            layout="responsive"
                            height={image.height}
                            width={image.width}
                            alt={image.alt}
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                        disabled={currentSlide === 0}>
                        <IoChevronBack className="text-xl" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                        disabled={currentSlide === images.length - 1}>
                        <IoChevronForward className="text-xl" />
                    </button>
                </>
            )}

            {/* Slide Indicators */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentSlide
                                    ? 'bg-white'
                                    : 'bg-white bg-opacity-50'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    if (href) {
        return (
            <a
                className="cursor-pointer block"
                href={href}
                target={target}
                rel={rel}>
                <CarouselContent />
            </a>
        );
    }

    return <CarouselContent />;
};

export default Carousel;
