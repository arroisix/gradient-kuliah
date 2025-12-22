import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import Layout from 'commons/utbkLayout';
import { cn } from 'commons/utils';
import Testimony from 'landing/components/Sections/Testimony';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

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
        <section className={cn('flex flex-col', className)}>
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

            <ul className="list-none gap-6 max-w-[1200px] self-center p-0 grid grid-cols-1 lg:grid-cols-2">
                <li>
                    <article
                        className="flex flex-col gap-4 text-center bg-[#181818] rounded-[32px] border-solid border-[1px] border-white border-opacity-5 px-8 pt-8 max-w-[720px] hover:border-[#B6A6F3] hover:shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] items-center h-full"
                        style={{
                            transitionProperty: 'box-shadow, border-color',
                            backgroundImage: `url(${CDN_URL}/assets/utbk/materi-decor.svg)`,
                            backgroundPosition: 'top right',
                            backgroundRepeat: 'no-repeat'
                        }}>
                        <h3 className="flex flex-col gap-4 text-white font-bold text-2xl leading-[125%]">
                            <span className="uppercase flex gap-2 items-center justify-center font-bold text-[#B6A6F3] text-sm tracking-[0.7px]">
                                <img
                                    src={`${CDN_URL}/assets/utbk/materi-icon.svg`}
                                    alt="Video icon"
                                    width={30}
                                />
                                Video Learning
                            </span>
                            Video Materi dari Kakak Mahasiswa Universitas Top
                        </h3>

                        <p className="text-white text-lg leading-[29.25px]">
                            Akses ratusan jam konten video yang dibawakan
                            langsung oleh mahasiswa dari UI, ITB, dan lainnya.
                            Penjelasan santai, mudah dimengerti, dan
                            to-the-point.
                        </p>

                        <Link
                            href="/utbk/materi"
                            className="mb-2 text-[#B6A6F3] font-semibold text-sm leading-[125%] flex gap-1 items-center h-[34px]">
                            Lihat Materi
                            <FaChevronRight height={16} width={16} />
                        </Link>
                        <div className="flex-grow flex items-end">
                            <img
                                src={`${CDN_URL}/assets/utbk/video.avif`}
                                alt="Video learning."
                                height={220}
                                className="h-[220px] sm:h-[450px] lg:h-[344px] object-contain object-bottom"
                            />
                        </div>
                    </article>
                </li>
                <li>
                    <article
                        className="flex items-center flex-col gap-4 text-center bg-[#181818] rounded-[32px] border-solid border-[1px] border-white border-opacity-5 px-8 pt-8 max-w-[720px] hover:border-[#B6A6F3] hover:shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] h-full"
                        style={{
                            transitionProperty: 'box-shadow, border-color',
                            backgroundImage: `url(${CDN_URL}/assets/utbk/try-out-decor.svg)`,
                            backgroundPosition: 'bottom center',
                            backgroundRepeat: 'no-repeat'
                        }}>
                        <h3 className="flex flex-col gap-4 text-white font-bold text-2xl leading-[125%]">
                            <span className="uppercase flex gap-2 items-center justify-center font-bold text-[#B6A6F3] text-sm tracking-[0.7px] h-9">
                                <img
                                    src={`${CDN_URL}/assets/utbk/try-out-icon.svg`}
                                    alt="Try out icon"
                                    width={24}
                                />
                                Try Out
                            </span>
                            Tryout Asli UTBK (IRT)
                        </h3>
                        <p className="text-white text-lg leading-[29.25px]">
                            Simulasi ujian dengan format yang sama persis dengan
                            UTBK asli. Menggunakan sistem penilaian Item
                            Response Theory untuk akurasi skor tinggi.
                        </p>
                        <Link
                            href="/utbk/materi"
                            className="mb-2 text-[#B6A6F3] font-semibold text-sm leading-[125%] h-[34px] flex items-center gap-1">
                            Apa itu IRT
                            <FaChevronRight height={16} width={16} />
                        </Link>
                        <div className="flex-grow flex items-end">
                            <img
                                src={`${CDN_URL}/assets/utbk/try-out.avif`}
                                alt="Try out."
                                height={220}
                                className="h-[220px] sm:h-[455px] lg:h-[380px] object-contain object-bottom"
                            />
                        </div>
                    </article>
                </li>
                <li>
                    <article
                        className="flex flex-col items-center gap-4 text-center bg-[#181818] rounded-[32px] border-solid border-[1px] border-white border-opacity-5 px-8 pt-8 max-w-[720px] hover:border-[#B6A6F3] hover:shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] h-full"
                        style={{
                            transitionProperty: 'box-shadow, border-color',
                            backgroundImage: `url(${CDN_URL}/assets/utbk/copilot-decor.svg)`,
                            backgroundPosition: 'bottom right',
                            backgroundRepeat: 'no-repeat'
                        }}>
                        <h3 className="flex flex-col gap-4 text-white font-bold text-2xl leading-[125%]">
                            <span className="uppercase flex gap-2 items-center justify-center font-bold text-[#B6A6F3] text-sm tracking-[0.7px] h-9">
                                <img
                                    src={`${CDN_URL}/assets/utbk/copilot-icon.svg`}
                                    alt="Copilot icon"
                                    width={32}
                                />
                                Assistant
                            </span>
                            Copilot AI Assistant
                        </h3>
                        <p className="text-white text-lg leading-[29.25px] mb-6">
                            Asisten belajar pribadi berbasis AI yang siap
                            membantumu. Tanyakan soal sulit atau minta
                            penjelasan materi yang belum kamu pahami.
                        </p>
                        <img
                            src={`${CDN_URL}/assets/utbk/copilot3.avif`}
                            alt="Copilot."
                            height={328}
                            className="h-[328px] sm:h-[459px] lg:h-[414px] object-contain object-bottom"
                        />
                    </article>
                </li>
                <li>
                    <article
                        className="flex flex-col items-center gap-4 text-center bg-[#181818] rounded-[32px] border-solid border-[1px] border-white border-opacity-5 px-8 pt-8 max-w-[720px] hover:border-[#B6A6F3] hover:shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] h-full"
                        style={{
                            transitionProperty: 'box-shadow, border-color',
                            backgroundImage: `url(${CDN_URL}/assets/utbk/analytics-decor.svg)`,
                            backgroundPosition: 'bottom center',
                            backgroundRepeat: 'no-repeat'
                        }}>
                        <h3 className="flex flex-col gap-4 text-white font-bold text-2xl leading-[125%]">
                            <span className="uppercase flex gap-2 items-center justify-center font-bold text-[#B6A6F3] text-sm tracking-[0.7px] h-9">
                                <img
                                    src={`${CDN_URL}/assets/utbk/analytics-icon.svg`}
                                    alt="Analytics icon"
                                    width={24}
                                />
                                Analytics
                            </span>
                            Personal Analytics
                        </h3>
                        <p className="text-white text-lg leading-[29.25px]">
                            Pantau kekuatan dan kelemahanmu secara real-time.
                            Data driven learning untuk hasil yang maksimal.
                        </p>
                        <p
                            className="text-[11px] leading-[16.5px] tracking-widest font-bold text-[#E9D5FF] border-solid border-[#A855F7] border-[1px] border-opacity-30 rounded-full bg-white bg-opacity-[3%] uppercase px-4 py-[6px] mb-2"
                            style={{
                                boxShadow:
                                    '0px 0px 20px rgba(124, 58, 237, 0.2)',
                                backdropFilter: 'blur(6px)'
                            }}>
                            Coming Soon
                        </p>
                        <div className="flex flex-grow items-center">
                            <img
                                src={`${CDN_URL}/assets/utbk/analytics2.avif`}
                                alt="Analytics."
                                height={311}
                                className="h-[311px] sm:h-[362px] lg:h-[389px] object-contain"
                            />
                        </div>
                    </article>
                </li>
            </ul>
        </section>
    );
}

function Langganan({ className }: { className?: string }): JSX.Element {
    return (
        <section className={className}>
            <h2 className="flex flex-col items-center text-center gap-3 text-white text-2xl leading-[125%] font-bold mb-3">
                Langganan untuk
                <br className="sm:hidden" /> mengakses semua materi
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
    return (
        <section
            className={cn(
                'rounded-3xl border-solid border-[1px] border-white border-opacity-10 py-[40px] px-[40px] max-w-[1028px] self-center w-full flex flex-col',
                className
            )}
            style={{
                background: 'linear-gradient(90deg, #111827 0%, #000000 100%)'
            }}>
            <div className="flex flex-col gap-8 items-center max-w-[676px] min-w-[287px] self-center">
                <img
                    src={`${CDN_URL}/assets/utbk/indonesia_asset.svg`}
                    alt="Peta pengguna Gradient di seluruh Indonesia."
                    height={100}
                    className="w-full h-auto"
                />
                <div className="flex flex-col w-full text-center gap-4">
                    <h2 className="text-white text-3xl font-bold">
                        200.000+ pelajar
                        <br className="sm:hidden" /> di Indonesia menggunakan
                        <br className="hidden sm:block" /> Gradient
                    </h2>
                    <p className="text-[#9CA3AF]">
                        Daftar untuk mengakses preview materi GRATIS
                    </p>
                    <Button
                        variant="primary"
                        className="h-[52px] min-w-[160px] self-center">
                        Coba Gratis
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default function UTBK(): JSX.Element {
    return (
        <Layout>
            <div className="flex flex-col w-full">
                <Hero />
                <Testimony
                    className="pt-24 pb-16 gap-[52px]"
                    headerClassName="text-white text-2xl leading-[125%]"
                />
                <Fitur className="mb-[40px] mx-4" />
                <Langganan className="mb-12 mx-4" />
                <FAQ className="mb-10 mx-4" />
                <FinalCTA />
            </div>
        </Layout>
    );
}
