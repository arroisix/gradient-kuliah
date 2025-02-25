import React, { useRef, useState, useEffect } from 'react';
import Container from './Container';
import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import Link from 'next/link';
import { MdArrowForward } from 'react-icons/md';
import { cn } from 'commons/utils';

const FeaturesRevamp = () => {
    const [activeSlideSection1, setActiveSlideSection1] = useState(0);
    const [activeSlideSection2, setActiveSlideSection2] = useState(0);
    const [activeSlideSection3, setActiveSlideSection3] = useState(0);

    const scrollRef1 = useRef<HTMLDivElement>(null);
    const scrollRef2 = useRef<HTMLDivElement>(null);
    const scrollRef3 = useRef<HTMLDivElement>(null);

    const handleScroll = (
        element: HTMLDivElement,
        setActiveSlide: (index: number) => void
    ) => {
        const scrollLeft = element.scrollLeft;
        const cardWidth = 266 + 24; // card width + gap
        const newActiveSlide = Math.round(scrollLeft / cardWidth);
        setActiveSlide(newActiveSlide);
    };

    useEffect(() => {
        const ref1 = scrollRef1.current;
        const ref2 = scrollRef2.current;
        const ref3 = scrollRef3.current;

        const handleScroll1 = () =>
            ref1 && handleScroll(ref1, setActiveSlideSection1);
        const handleScroll2 = () =>
            ref2 && handleScroll(ref2, setActiveSlideSection2);
        const handleScroll3 = () =>
            ref3 && handleScroll(ref3, setActiveSlideSection3);

        ref1?.addEventListener('scroll', handleScroll1);
        ref2?.addEventListener('scroll', handleScroll2);
        ref3?.addEventListener('scroll', handleScroll3);

        return () => {
            ref1?.removeEventListener('scroll', handleScroll1);
            ref2?.removeEventListener('scroll', handleScroll2);
            ref3?.removeEventListener('scroll', handleScroll3);
        };
    }, []);

    return (
        <div className="bg-[#181818]">
            <Container className="py-16">
                <h2 className="font-sans text-center text-[20px] font-bold mb-6">
                    Tingkatkan Pengalaman Belajar dengan Fitur-Fitur Gradient
                </h2>
                <div className="flex flex-col gap-4">
                    <div
                        ref={scrollRef1}
                        className="flex overflow-x-auto gap-6 md:grid md:grid-cols-2 no-scrollbar">
                        <FeatureCard
                            title="1500+ video dengan konsep menyeluruh"
                            subtitle="Diajarkan oleh dosen yang ahli di berbagai bidang dan jurusan"
                            imageName="feature-video-2.png"
                            href="/kelas"
                        />
                        <FeatureCard
                            title="Komunitas untuk belajar bersama"
                            subtitle="Diskusi dengan tutor terverifikasi dan sesama pelajar"
                            imageName="feature-diskusi.png"
                            href="/komunitas"
                        />
                    </div>
                    <div className="flex justify-center items-center gap-2 md:hidden">
                        {[0, 1].map((index) => (
                            <div
                                key={`indicator-1-${index}`}
                                className={cn(
                                    'h-2 rounded-full transition-all duration-200',
                                    activeSlideSection1 === index
                                        ? 'w-8 bg-[#494BA0]'
                                        : 'w-2 bg-[#404040]'
                                )}
                            />
                        ))}
                    </div>
                </div>
            </Container>

            <Container className="py-16">
                <h2 className="font-sans text-center text-[20px] font-bold mb-6">
                    Belajar Cepat dengan Dukungan AI dan Alat Belajar Interaktif
                </h2>
                <div className="flex flex-col gap-4">
                    <div
                        ref={scrollRef2}
                        className="flex overflow-x-auto gap-6 md:grid md:grid-cols-3 no-scrollbar">
                        <FeatureCard
                            title="Copilot AI"
                            subtitle="Asisten belajar AI yang bisa jawab apapun, gak kalah sama Chat GPT"
                            imageName="feature-copilot-2.png"
                            href="/copilot"
                        />
                        <FeatureCard
                            title="Flashcard"
                            subtitle="Belajar kebut semalam dengan bantuan AI, menghafal lebih cepat"
                            imageName="feature-flashcard.png"
                            href="/flashcard"
                        />
                        <FeatureCard
                            title="Kuis"
                            subtitle="Uji kemampuanmu dan temukan area yang perlu ditingkatkan"
                            imageName="feature-kuis.png"
                            href="/latihan"
                        />
                    </div>
                    <div className="flex justify-center items-center gap-2 md:hidden">
                        {[0, 1, 2].map((index) => (
                            <div
                                key={`indicator-2-${index}`}
                                className={cn(
                                    'h-2 rounded-full transition-all duration-200',
                                    activeSlideSection2 === index
                                        ? 'w-8 bg-[#494BA0]'
                                        : 'w-2 bg-[#404040]'
                                )}
                            />
                        ))}
                    </div>
                </div>
            </Container>

            <Container className="py-16">
                <h2 className="font-sans text-center text-[20px] font-bold mb-6">
                    Perdalam Pemahaman dengan Soal dan Rangkuman
                </h2>
                <div className="flex flex-col gap-4">
                    <div
                        ref={scrollRef3}
                        className="flex overflow-x-auto gap-6 md:grid md:grid-cols-3 no-scrollbar">
                        <FeatureCard
                            title="Textbook Solution"
                            subtitle="Jawaban dan pembahasan untuk soal di textbook kuliah terpopuler"
                            imageName="feature-textbook.png"
                            href="/perpustakaan/textbook"
                        />
                        <FeatureCard
                            title="Bank Soal"
                            subtitle="Soal ujian dari berbagai universitas, beserta pembahasannya"
                            imageName="feature-bank-soal.png"
                            href="/perpustakaan/bank-soal"
                        />
                        <FeatureCard
                            title="Astronotes"
                            subtitle="Rangkuman materi, lengkap dengan rumus, ilustrasi, dan contoh"
                            imageName="feature-astronotes-2.png"
                            href="/perpustakaan/astronotes"
                        />
                    </div>
                    <div className="flex justify-center items-center gap-2 md:hidden">
                        {[0, 1, 2].map((index) => (
                            <div
                                key={`indicator-3-${index}`}
                                className={cn(
                                    'h-2 rounded-full transition-all duration-200',
                                    activeSlideSection3 === index
                                        ? 'w-8 bg-[#494BA0]'
                                        : 'w-2 bg-[#404040]'
                                )}
                            />
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
};

interface FeatureCardProps {
    title: string;
    subtitle: string;
    imageName: string;
    href: string;
}

const FeatureCard = ({
    title,
    subtitle,
    imageName,
    href
}: FeatureCardProps) => {
    return (
        <div
            className="flex-none w-[266px] md:w-auto bg-[#272727] rounded-xl overflow-hidden"
            id="features">
            <div className="relative aspect-[266/145] max-h-[200px] w-full">
                <Image
                    src={`${CDN_URL}/assets/${imageName}`}
                    alt={title}
                    layout="fill"
                    className="object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="font-sans text-xl font-bold">{title}</h3>
                <p className="text-[#CCCCCC] h-[64px] text-sm mt-2">
                    {subtitle}
                </p>
                <div className="flex justify-end mt-2">
                    <Link
                        href={href}
                        className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border border-[#999999]">
                        Lihat
                        <MdArrowForward className="text-lg" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturesRevamp;
