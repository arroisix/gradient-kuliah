import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BiChevronRight } from 'react-icons/bi';
import Container from './Container';
import { useTracker } from 'tracker/tracker';

const RevampedFeature = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const tracker = useTracker();

    const track = (feature: string): void => {
        tracker?.genericTrack('Click Feature Card', { Feature: feature });
    };

    return (
        <Container className="space-y-8 py-9 md:py-24">
            <h2 className="text-3xl font-extrabold leading-relaxed text-center ">
                Pilih fitur yang sesuai dengan cara belajarmu
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-6 lg:gap-8">
                <Link
                    href="/kelas"
                    onClick={() => track('Video')}
                    className="relative px-8 pt-6 md:col-span-3 card bg-neutral-800 rounded-xl">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="pb-2 text-2xl font-extrabold">
                                Tonton Video
                            </h3>
                            <p>330+ video kelas on-demand</p>
                        </div>
                        <Chevron />
                    </div>
                    <div className="relative bottom-0 flex items-end justify-center mt-6 shadow-[6px_6px_80px_0px_rgba(52,2,159,0.10)]">
                        <Image
                            src={`${CDN_URL}/assets/feature-video-revamp.png`}
                            loading="lazy"
                            width={393}
                            height={212}
                        />
                    </div>
                </Link>
                <Link
                    href="/astronotes#bank-soal"
                    onClick={() => track('Bank Soal')}
                    className="flex flex-col-reverse gap-6 p-4 pt-5 pb-0 sm:py-6 sm:flex-row md:col-span-3 md:gap-4 xl:gap-8 xl:px-8 card bg-neutral-800 rounded-xl">
                    <div className="flex items-end justify-center sm:aspect-[228/280] w-full md:w-[342px] lg:w-full lg:my-2 xl:my-0">
                        <Image
                            src={`${CDN_URL}/assets/feature-${
                                isMobileBreakpoints
                                    ? 'soal-revamp-mobile'
                                    : 'soal-revamp'
                            }.png`}
                            loading="lazy"
                            width={isMobileBreakpoints ? 247 * 2 : 228 * 2}
                            height={isMobileBreakpoints ? 205 * 2 : 280 * 2}
                        />
                    </div>
                    <div className="flex flex-row-reverse items-start gap-4 sm:items-end sm:flex-col md:gap-12">
                        <Chevron />
                        <div className="self-start">
                            <h3 className="pb-2 text-xl font-extrabold xl:text-2xl">
                                Latihan Soal &amp; Pembahasan Ujian Tahun Lalu
                            </h3>
                            <p>Soal asli dari berbagai kampus</p>
                        </div>
                    </div>
                </Link>
                <Link
                    href="/astronotes"
                    onClick={() => track('Rangkuman')}
                    className="flex flex-col px-6 pt-6 md:col-span-2 card bg-neutral-800 rounded-xl">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="pb-2 text-xl font-extrabold">
                                Rangkuman
                            </h3>
                            <p>Ilustrasi &amp; teks yang mudah dibaca</p>
                        </div>
                        <Chevron />
                    </div>
                    <div className="flex items-end justify-center flex-1 mt-6">
                        <Image
                            src={`${CDN_URL}/assets/feature-astronotes-revamp.png`}
                            loading="lazy"
                            width={305}
                            height={257}
                        />
                    </div>
                </Link>
                <Link
                    href="/komunitas"
                    onClick={() => track('Komunitas')}
                    className="flex flex-col px-6 pt-6 md:col-span-2 card bg-neutral-800 rounded-xl">
                    <div className="flex justify-between gap-4">
                        <div>
                            <h3 className="pb-2 text-xl font-extrabold">
                                Diskusi Sesama Pelajar
                            </h3>
                            <p className="hidden xl:block">
                                Melalui WhatsApp, Discord, dan website Gradient
                            </p>
                        </div>
                        <Chevron />
                    </div>
                    <p className="xl:hidden">
                        Melalui WhatsApp, Discord, dan website Gradient
                    </p>
                    <div className="flex items-end justify-center flex-1 mt-6">
                        <Image
                            src={`${CDN_URL}/assets/feature-komunitas-revamp.png`}
                            loading="lazy"
                            width={339}
                            height={233}
                        />
                    </div>
                </Link>
                <div className="px-6 pt-6 md:col-span-2 card bg-neutral-800 rounded-xl">
                    <h3 className="pb-2 text-xl font-extrabold">
                        Bingung? Tanya Copilot!
                    </h3>
                    <p>
                        Asisten AI yang bisa jawab apapun, gak kalah sama Chat
                        GPT!
                    </p>
                    <div className="mx-auto mt-6 mb-2">
                        <Image
                            src={`${CDN_URL}/assets/feature-chatbot-revamp.png`}
                            loading="lazy"
                            width={303}
                            height={198}
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
};

const Chevron = (): JSX.Element => (
    <Button
        variant="primary"
        className="flex flex-none items-center w-10 h-10 !p-0 shadow-xl justify-center">
        <BiChevronRight size={24} />
    </Button>
);

export default RevampedFeature;
