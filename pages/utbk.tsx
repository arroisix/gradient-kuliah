import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import Layout from 'commons/utbkLayout';
import Testimony from 'landing/components/Sections/Testimony';
import Image from 'next/image';
import React from 'react';

function Hero(): JSX.Element {
    return (
        <section className="max-h-[832px] min-h-[775px] w-full aspect-[20/13] relative flex justify-center">
            <picture className="absolute pointer-events-none">
                <source
                    srcSet={`${CDN_URL}/assets/utbk/hero.avif`}
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
                    src={`${CDN_URL}/assets/utbk/hero.avif`}
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
                <h1 className="text-[32px] -tracking-[2.4px] text-white font-extrabold max-w-[238px] text-center mb-4">
                    Masuk Kampus Impian
                    <br /> Mulai dari Sini.
                </h1>
                <p className="text-center text-[#DEDEDE] text-base leading-[140%] font-semibold max-w-[327px] mb-10">
                    Sistem persiapan UTBK cerdas yang menghubungkan materi
                    adaptif, analisis AI, dan tryout berbasis IRT dalam satu
                    ekosistem belajar.
                </p>
                <div className="flex flex-col md:flex-row gap-4 self-center mb-16 px-[54px] max-w-[564px] w-full">
                    <Button variant="primary" className="h-[52px] w-full">
                        Coba Gratis
                    </Button>
                    <Button variant="secondary" className="h-[52px] w-full">
                        Apa itu UTBK?
                    </Button>
                </div>

                <ul className="flex [&>li:not(:first-child)]:-ml-3 *:rounded-full *:h-[50px] *:w-[50px] *:flex list-none p-0 mb-6">
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

                <img
                    src={`${CDN_URL}/assets/utbk/stars.svg`}
                    height={24}
                    alt=""
                    aria-hidden
                    className="mb-2"
                />

                <p className="text-sm leading-4">
                    Dipercaya <b>200k+ pelajar</b> Indonesia
                </p>
            </div>
        </section>
    );
}

function Fitur({ className }: { className?: string }): JSX.Element {
    return (
        <section className={className}>
            <h2 className="flex flex-col items-center text-center gap-3 text-white text-2xl leading-[125%] font-bold mb-3">
                <span className="text-[11px] leading-[13px] text-bold uppercase text-black bg-[#B6A6F3] tracking-widest px-[15px] py-[5px] border-solid border-[#A855F7] border-opacity-30 border-[1px] rounded-full">
                    Fitur Lengkap
                </span>
                Semua yang kamu butuhkan untuk lulus UTBK
            </h2>
            <p className="text-[#9CA3AF] text-base leading-[150%] text-center mb-16">
                Platform all-in-one dengan fitur canggih untuk memastikan kamu
                siap tempur di hari H.
            </p>

            <ul className="list-none flex flex-col gap-6">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </section>
    );
}

function Langganan({ className }: { className?: string }): JSX.Element {
    return (
        <section className={className}>
            <h2 className="flex flex-col items-center text-center gap-3 text-white text-2xl leading-[125%] font-bold mb-3">
                Langganan untuk
                <br /> mengakses semua materi
            </h2>
            <p className="text-[#9CA3AF] text-base leading-[150%] text-center mb-16">
                Pilih paket yang paling pas buat target UTBK kamu.
            </p>
        </section>
    );
}

function FAQ({ className }: { className?: string }): JSX.Element {
    return (
        <section className={className}>
            <h2 className="flex flex-col items-center text-center gap-3 text-white text-2xl leading-[125%] font-bold mb-3">
                Sering Ditanyakan
            </h2>
            <p className="text-[#9CA3AF] text-base leading-[150%] text-center mb-16">
                Jawaban untuk pertanyaan seputar persiapan UTBK di Gradient.
            </p>
        </section>
    );
}

function FinalCTA({ className }: { className?: string }): JSX.Element {
    return <section className={className}></section>;
}

export default function UTBK(): JSX.Element {
    return (
        <Layout>
            <div className="flex flex-col w-full">
                <Hero />
                <Testimony className="pt-24 pb-16" />
                <Fitur className="mb-[40px] mx-4" />
                <Langganan className="mb-12 mx-4" />
                <FAQ className="mb-10 mx-4" />
                <FinalCTA />
            </div>
        </Layout>
    );
}
