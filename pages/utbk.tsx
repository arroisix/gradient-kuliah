import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import Layout from 'commons/utbkLayout';
import Testimony from 'landing/components/Sections/Testimony';
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

            <div className="flex flex-col items-center z-10 mt-[110px]">
                <p
                    className="text-[11px] leading-[16.5px] uppercase tracking-widest text-[#E9D5FF] border-solid border-[1px] border-opacity-30 border-[#A855F74D] rounded-md px-4 py-[6px] mb-8"
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
                <div className="flex flex-col gap-4 self-stretch mb-16">
                    <Button variant="primary" className="h-[52px]">
                        Coba Gratis
                    </Button>
                    <Button variant="secondary" className="h-[52px]">
                        Apa itu UTBK?
                    </Button>
                </div>

                <ul className='flex [&>li:not(:first-child)]:-ml-3 *:rounded-full *:h-[50px] *:w-[50px] *:flex list-none p-0'>
                    <li>
                        <img src={`${CDN_URL}/assets/testimonials/achmad-adil.jpg`} alt="" data-avatar className='w-full object-cover rounded-full border-solid border-2 border-black' />
                    </li>
                    <li>
                        <img src={`${CDN_URL}/assets/testimonials/achmad-eugene-its.jpg`} alt="" data-avatar className='w-full object-cover rounded-full border-solid border-2 border-black' />
                    </li>
                    <li>
                        <img src={`${CDN_URL}/assets/testimonials/novia-unbraw.jpg`} alt="" data-avatar className='w-full object-cover rounded-full border-solid border-2 border-black' />
                    </li>
                    <li className='bg-[#1F2937] flex items-center justify-center border-solid border-2 border-black'>
                        <p className='text-[#9CA3AF] font-bold'>+2k</p>
                    </li>
                </ul>
            </div>
        </section>
    );
}

export default function UTBK(): JSX.Element {
    return (
        <Layout>
            <div className="flex flex-col">
                <Hero />
                <Testimony />
            </div>
        </Layout>
    );
}
