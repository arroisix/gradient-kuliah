import Image from 'next/image';

// Exact pin positions from Figma (frame 960x285)
const universityPins = [
    { id: 1, image: '/figma/univ-1.png', left: '22.71%', top: '74.74%' },
    { id: 2, image: '/figma/univ-2.png', left: '0%', top: '0%' },
    { id: 3, image: '/figma/univ-3.png', left: '10.42%', top: '37.54%' },
    { id: 4, image: '/figma/univ-4.png', left: '18.33%', top: '65.61%' },
    { id: 5, image: '/figma/univ-5.png', left: '24.48%', top: '82.81%' },
    { id: 6, image: '/figma/univ-6.png', left: '29.38%', top: '82.11%' },
    { id: 7, image: '/figma/univ-7.png', left: '29.69%', top: '31.58%' },
    { id: 8, image: '/figma/univ-8.png', left: '38.33%', top: '48.77%' },
    { id: 9, image: '/figma/univ-9.png', left: '44.9%', top: '37.19%' },
    { id: 10, image: '/figma/univ-10.png', left: '63.02%', top: '23.51%' },
    { id: 11, image: '/figma/univ-11.png', left: '70.83%', top: '54.39%' },
    { id: 12, image: '/figma/univ-12.png', left: '96.04%', top: '51.58%' },
    { id: 13, image: '/figma/univ-13.png', left: '96.67%', top: '83.51%' },
    { id: 14, image: '/figma/univ-14.png', left: '57.71%', top: '25.96%' },
    { id: 15, image: '/figma/univ-15.png', left: '51.15%', top: '51.23%' },
    { id: 16, image: '/figma/univ-16.png', left: '57.4%', top: '59.65%' },
    { id: 17, image: '/figma/univ-17.png', left: '53.13%', top: '65.61%' },
    { id: 18, image: '/figma/univ-18.png', left: '37.08%', top: '87.37%' },
    { id: 19, image: '/figma/univ-19.png', left: '41.77%', top: '88.77%' }
];

const CTASection = (): JSX.Element => {
    return (
        <section className="relative w-full overflow-hidden">
            {/* Black base background */}
            <div className="absolute inset-0 bg-black" />

            {/* Background image - ellipse + blue hue combined */}
            <div className="absolute inset-0 -top-[280px]">
                <Image
                    src="/assets/kuliah/bg.webp"
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    objectPosition="top"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative max-w-[1280px] mx-auto px-6 md:px-[60px] pt-48 pb-16 md:pt-56 md:pb-24">
                {/* Indonesia Map with university pins */}
                <div className="relative w-full max-w-[960px] mx-auto aspect-[960/285] mb-12 overflow-visible">
                    {/* Map */}
                    <Image
                        src="/figma/indonesia-map.svg"
                        alt="Indonesia Map"
                        layout="fill"
                        objectFit="contain"
                    />

                    {/* University pins */}
                    {universityPins.map((pin) => (
                        <div
                            key={pin.id}
                            className="absolute w-[24px] h-[24px] md:w-[32px] md:h-[32px] z-20"
                            style={{ left: pin.left, top: pin.top }}>
                            {/* Pin marker background */}
                            <Image
                                src="/figma/pin-marker.svg"
                                alt=""
                                layout="fill"
                            />
                            {/* University logo */}
                            <div className="absolute inset-[15%] rounded-full overflow-hidden">
                                <Image
                                    src={pin.image}
                                    alt="University"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Text content */}
                <div className="relative flex flex-col items-center gap-4 text-center">
                    <h2 className="text-[24px] md:text-[30px] font-bold text-white leading-[1.2]">
                        <span className="relative inline-block isolate">
                            {/* Purple parallelogram overlay */}
                            <span
                                className="absolute -left-2 right-0 top-[45%] bottom-[-4px] bg-accent-purple -z-10"
                                style={{ transform: 'skewX(-12deg)' }}
                            />
                            <span className="relative z-10">
                                200.000+ pelajar
                            </span>
                        </span>{' '}
                        di Indonesia menggunakan Gradient
                    </h2>

                    <p className="text-neutral-400 text-base leading-normal">
                        Satu langkah menuju nilai yang lebih baik
                    </p>

                    <button className="mt-2 px-5 py-3 h-[52px] bg-accent-purple hover:bg-accent-purple/90 text-white text-base font-semibold rounded-full transition-colors">
                        Daftar Sekarang
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
