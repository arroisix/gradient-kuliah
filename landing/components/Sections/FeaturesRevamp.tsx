import React from 'react';
import Container from './Container';
import { CDN_URL } from 'commons/constants';
import Image from 'next/image';
import Link from 'next/link';
import { MdArrowForward } from 'react-icons/md';

const FeaturesRevamp = () => {
    return (
        <div className="bg-[#181818]">
            <Container className="py-16">
                <h2 className="font-sans text-center text-2xl font-bold mb-6">
                    Tingkatkan Pengalaman Belajar dengan Fitur-Fitur Gradient
                </h2>
                <div className="flex overflow-x-auto gap-6 md:grid md:grid-cols-2 no-scrollbar">
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
            </Container>

            <Container className="py-16">
                <h2 className="font-sans text-center text-2xl font-bold mb-6">
                    Belajar Cepat dengan Dukungan AI dan Alat Belajar Interaktif
                </h2>
                <div className="flex overflow-x-auto gap-6 md:grid md:grid-cols-3 no-scrollbar">
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
            </Container>

            <Container className="py-16">
                <h2 className="font-sans text-center text-2xl font-bold mb-6">
                    Perdalam Pemahaman dengan Soal dan Rangkuman
                </h2>
                <div className="flex overflow-x-auto gap-6 md:grid md:grid-cols-3 no-scrollbar">
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
        <div className="flex-none w-[266px] md:w-auto bg-[#272727] rounded-xl overflow-hidden">
            <div className="relative aspect-[16/10] w-full">
                <Image
                    src={`${CDN_URL}/assets/${imageName}`}
                    alt={title}
                    layout="fill"
                    className="object-cover"
                />
            </div>
            <div className="p-6">
                <h3 className="font-sans text-xl font-bold">{title}</h3>
                <p className="text-[#CCCCCC] h-[64px] text-sm mt-2">{subtitle}</p>
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
