import React from 'react';
import Container from './Container';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';
import { BiChevronRight } from 'react-icons/bi';
import Button from 'commons/components/elements/Button';
import Link from 'next/link';

const RevampedFeature = (): JSX.Element => {
    return (
        <Container className="py-24 space-y-8">
            <h2 className="text-3xl font-extrabold leading-relaxed text-center ">
                Pilih fitur yang sesuai dengan cara belajarmu
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-6 lg:gap-8">
                <Link
                    href="/kelas"
                    className="relative px-8 pt-6 lg:col-span-3 card bg-neutral-800 rounded-xl">
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
                    className="flex flex-row p-4 py-6 lg:col-span-3 md:gap-4 xl:gap-8 xl:px-8 card bg-neutral-800 rounded-xl">
                    <div className="aspect-[228/280] md:w-[342px] lg:w-full lg:my-2 xl:my-0">
                        <Image
                            src={`${CDN_URL}/assets/feature-soal-revamp.png`}
                            loading="lazy"
                            width={228 * 2}
                            height={280 * 2}
                        />
                    </div>
                    <div className="flex flex-col items-end gap-4 md:gap-12">
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
                    className="flex flex-col px-6 pt-6 lg:col-span-2 card bg-neutral-800 rounded-xl">
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
                    className="flex flex-col px-6 pt-6 lg:col-span-2 card bg-neutral-800 rounded-xl">
                    <div className="flex justify-between">
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
                <div className="px-6 pt-6 lg:col-span-2 card bg-neutral-800 rounded-xl">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="pb-2 text-xl font-extrabold">
                                Bingung? Tanya Copilot!
                            </h3>
                            <p className="hidden xl:block">
                                Asisten AI yang bisa jawab apapun, gak kalah
                                sama Chat GPT!
                            </p>
                        </div>
                        <Chevron />
                    </div>
                    <p className="xl:hidden">
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
