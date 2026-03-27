import { useEffect, useState } from 'react';
import BenefitCard from './BenefitCard';

const benefits = [
    {
        tag: 'Kelas',
        title: '200.000+ Video Materi dari Dosen Top Universitas',
        description:
            'Diajarkan oleh dosen yang ahli di berbagai bidang dan jurusan',
        linkText: 'Lihat Daftar Kelas',
        accentColor: '#5F2BCE',
        variant: 'lottie' as const,
        showPlayIcon: true
    },
    {
        tag: 'Try out',
        title: 'Try Out UTS dan UAS Materi Kuliah',
        description:
            'Latihan Soal yang dikurasi Gradient buat nge-boost pemahaman dan nilai kuliahmu.',
        linkText: 'Lihat Daftar Try Out',
        accentColor: '#5F2BCE',
        variant: 'lottie' as const,
        tryoutStyle: true,
        showTryoutIcon: true
    },
    {
        tag: 'Assistant',
        title: 'Copilot AI Assistant',
        description:
            'Asisten belajar pribadi berbasis AI yang siap membantumu. Tanyakan soal sulit atau minta penjelasan materi yang belum kamu pahami!',
        linkText: '',
        accentColor: '#5F2BCE',
        variant: 'lottie' as const,
        tagIcon: '/assets/kuliah/copilot-icon.svg',
        copilotStyle: true
    },
    {
        tag: 'Pembahasan Soal',
        title: 'Textbook Solution',
        description:
            'Jawaban dan pembahasan soal-soal yang dari kuis yang kamu kerjakan, supaya pemahaman dan nilaimu naik bareng.',
        linkText: '',
        accentColor: '#5F2BCE',
        variant: 'lottie' as const,
        textbookStyle: true,
        tagIcon: '/assets/kuliah/textbook-icon-new.svg'
    },
    {
        tag: 'Bank Soal',
        title: 'Latihan Ujian',
        description:
            'Kumpulan latihan ujian dari berbagai universitas, lengkap dengan pembahasan langkah demi langkah biar kamu makin siap hadapi tes.',
        linkText: '',
        accentColor: '#5F2BCE',
        variant: 'lottie' as const,
        banksoalStyle: true,
        tagIcon: '/assets/kuliah/banksoal-icon.svg'
    },
    {
        tag: 'Rangkuman Materi',
        title: 'Astronotes',
        description:
            'Ringkasan materi kuliah yang padat dan jelas, lengkap dengan rumus, ilustrasi, dan contoh soal.',
        linkText: '',
        accentColor: '#5F2BCE',
        astronotesStyle: true,
        tagIcon: '/assets/kuliah/astronotes-icon.svg',
        astronotesImages: [
            '/assets/kuliah/astronotes-1.webp',
            '/assets/kuliah/astronotes-2.webp',
            '/assets/kuliah/astronotes-3.webp'
        ]
    }
];

const BenefitSection = (): JSX.Element => {
    const [lecturerAnimation, setLecturerAnimation] = useState<object | null>(
        null
    );
    const [copilotAnimation, setCopilotAnimation] = useState<object | null>(
        null
    );
    const [tryoutAnimation, setTryoutAnimation] = useState<object | null>(
        null
    );
    const [textbookAnimation, setTextbookAnimation] = useState<object | null>(
        null
    );
    const [banksoalAnimation, setBanksoalAnimation] = useState<object | null>(
        null
    );

    useEffect(() => {
        fetch('/assets/kuliah/lecturer.json')
            .then((res) => res.json())
            .then((data) => setLecturerAnimation(data))
            .catch((err) =>
                console.error('Failed to load lecturer animation:', err)
            );

        fetch('/assets/kuliah/copilot.json')
            .then((res) => res.json())
            .then((data) => setCopilotAnimation(data))
            .catch((err) =>
                console.error('Failed to load copilot animation:', err)
            );

        fetch('/assets/kuliah/tryout.json')
            .then((res) => res.json())
            .then((data) => setTryoutAnimation(data))
            .catch((err) =>
                console.error('Failed to load tryout animation:', err)
            );

        fetch('/assets/kuliah/textbook.json')
            .then((res) => res.json())
            .then((data) => setTextbookAnimation(data))
            .catch((err) =>
                console.error('Failed to load textbook animation:', err)
            );

        fetch('/assets/kuliah/banksoal.json')
            .then((res) => res.json())
            .then((data) => setBanksoalAnimation(data))
            .catch((err) =>
                console.error('Failed to load banksoal animation:', err)
            );
    }, []);

    return (
        <section className="w-full bg-black py-20">
            <div className="max-w-[1280px] mx-auto px-6 md:px-[60px]">
                {/* Heading */}
                <div className="animate-fade-up animate-once animate-duration-500 flex flex-col gap-4 items-center text-center max-w-[900px] mx-auto mb-12">
                    <h2 className="text-[32px] md:text-[64px] font-bold text-white leading-[1.25]">
                        Semua yang kamu butuhkan untuk raih IPK idaman
                    </h2>
                    <p className="text-lg text-neutral-400 leading-relaxed">
                        Tingkatkan Pengalaman Belajar dengan Fitur-Fitur
                        Gradient
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First row - Kelas card with Lottie animation */}
                    <div className="animate-fade-up animate-once animate-duration-500">
                        <BenefitCard
                            {...benefits[0]}
                            lottieData={lecturerAnimation ?? undefined}
                            className="h-[500px] md:h-[680px]"
                        />
                    </div>
                    <div className="animate-fade-up animate-once animate-duration-500 animate-delay-100">
                        <BenefitCard
                            {...benefits[1]}
                            lottieData={tryoutAnimation ?? undefined}
                            className="h-[500px] md:h-[680px]"
                        />
                    </div>

                    {/* Second row */}
                    <div className="animate-fade-up animate-once animate-duration-500 animate-delay-200">
                        <BenefitCard
                            {...benefits[2]}
                            lottieData={copilotAnimation ?? undefined}
                            className="h-[500px] md:h-[680px]"
                        />
                    </div>
                    <div className="animate-fade-up animate-once animate-duration-500 animate-delay-300">
                        <BenefitCard
                            {...benefits[3]}
                            lottieData={textbookAnimation ?? undefined}
                            className="h-[500px] md:h-[680px]"
                        />
                    </div>

                    {/* Third row - Bank Soal & Placeholder */}
                    <div className="animate-fade-up animate-once animate-duration-500 animate-delay-[400ms]">
                        <BenefitCard
                            {...benefits[4]}
                            lottieData={banksoalAnimation ?? undefined}
                            className="h-[500px] md:h-[680px]"
                        />
                    </div>
                    <div className="animate-fade-up animate-once animate-duration-500 animate-delay-500">
                        <BenefitCard
                            {...benefits[5]}
                            className="h-[500px] md:h-[680px]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BenefitSection;
