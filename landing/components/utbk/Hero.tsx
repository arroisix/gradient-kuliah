import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import UTBKModal from 'landing/components/utbk/UTBKModal';
import Image from 'next/image';
import { useState } from 'react';
import styles from 'styles/utbk.module.css';

export default function Hero(): JSX.Element {
    const [showUTBKModal, setShowUTBKModal] = useState(false);

    return (
        <section className="max-h-[832px] min-h-[775px] w-full aspect-[20/13] relative flex justify-center">
            <picture className="absolute pointer-events-none">
                <source
                    srcSet={`${CDN_URL}/assets/utbk/hero6.avif`}
                    type="image/avif"
                    media="(min-width: 861px)"
                    className="max-h-[832px] min-h-[775px] object-cover"
                />
                <source
                    srcSet={`${CDN_URL}/assets/utbk/hero-tablet2.avif`}
                    type="image/avif"
                    media="(min-width: 376px)"
                    className="max-h-[832px] min-h-[775px] object-cover"
                />
                <source
                    srcSet={`${CDN_URL}/assets/utbk/hero-mobile.avif`}
                    type="image/avif"
                    className="max-h-[832px] min-h-[775px] object-cover"
                />
                <img
                    src={`${CDN_URL}/assets/utbk/hero6.avif`}
                    alt=""
                    className="max-h-[832px] min-h-[775px] object-cover"
                />
            </picture>

            <div className="flex flex-col items-center z-10 mt-[110px] w-full">
                <p
                    className="text-[11px] leading-[16.5px] uppercase tracking-widest text-[#E9D5FF] border-solid border-[1px] border-opacity-30 border-[#A855F74D] rounded-md px-4 py-[6px] mb-8 text-center"
                    style={{
                        boxShadow: '0px 0px 20px rgba(124, 58, 237, 0.2)',
                        backdropFilter: 'blur(6px)'
                    }}>
                    Platform Belajar No. 1 Untuk UTBK
                </p>
                <h1 className="text-[32px] -tracking-[2.4px] text-white font-extrabold max-w-[238px] md:max-w-[703px] text-center mb-4 md:text-[96px] md:leading-[96px]">
                    Masuk Kampus{' '}
                    <span
                        className={cn(
                            'relative inline-flex justify-center',
                            styles['hero-decor']
                        )}>
                        Impian
                    </span>
                    <br /> Mulai dari Sini.
                </h1>
                <p className="text-center text-[#DEDEDE] text-base md:text-xl leading-[140%] font-semibold max-w-[327px] md:max-w-[664px] mb-10">
                    Sistem persiapan UTBK cerdas yang menghubungkan materi
                    adaptif, analisis AI, dan tryout berbasis IRT dalam satu
                    ekosistem belajar.
                </p>
                <div className="flex flex-col md:flex-row gap-4 self-center mb-16 px-[54px] max-w-[564px] w-full">
                    <Button
                        variant="primary"
                        linkClass="h-[52px] w-full md:basis-1/2"
                        className="h-[52px] flex items-center justify-center font-semibold"
                        href="/daftar">
                        Coba Gratis
                    </Button>
                    <Button
                        variant="secondary"
                        className="h-[52px] w-full font-semibold md:basis-1/2"
                        onClick={() => setShowUTBKModal(true)}>
                        Apa itu UTBK?
                    </Button>
                </div>

                <div className="flex flex-col items-center md:flex-row gap-6">
                    <ul className="flex [&>li:not(:first-child)]:-ml-3 *:rounded-full *:h-[50px] *:w-[50px] *:flex list-none p-0">
                        <li>
                            <Image
                                src={`${CDN_URL}/assets/testimonials/achmad-adil.jpg`}
                                data-avatar
                                className="w-full object-cover rounded-full !border-solid !border-2 !border-black"
                                height={50}
                                width={50}
                                loading="lazy"
                            />
                        </li>
                        <li>
                            <Image
                                src={`${CDN_URL}/assets/testimonials/achmad-eugene-its.jpg`}
                                data-avatar
                                className="w-full object-cover rounded-full !border-solid !border-2 !border-black"
                                height={50}
                                width={50}
                                loading="lazy"
                            />
                        </li>
                        <li>
                            <Image
                                src={`${CDN_URL}/assets/testimonials/novia-unbraw.jpg`}
                                data-avatar
                                className="w-full object-cover rounded-full !border-solid !border-2 !border-black"
                                height={50}
                                width={50}
                                loading="lazy"
                            />
                        </li>
                        <li className="bg-[#1F2937] flex items-center justify-center border-solid border-2 border-black">
                            <p className="text-[#9CA3AF] font-bold">+2k</p>
                        </li>
                    </ul>

                    <div className="flex flex-col items-center md:items-start">
                        <img
                            src={`${CDN_URL}/assets/utbk/stars.svg`}
                            height={24}
                            alt=""
                            aria-hidden
                            className="mb-2"
                        />

                        <p className="text-sm leading-4 text-graphite-400 font-medium">
                            Dipercaya{' '}
                            <b className="text-white">200k+ pelajar</b>{' '}
                            Indonesia
                        </p>
                    </div>
                </div>
            </div>

            <UTBKModal open={showUTBKModal} setOpen={setShowUTBKModal} />
        </section>
    );
}
