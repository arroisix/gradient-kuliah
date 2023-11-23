import Button from 'commons/components/elements/Button';
import Image from 'next/image';
import React, { useState } from 'react';
import Container from './Container';
import { CDN_URL } from 'commons/constants';

const RevampedHero = ({
    majorData
}: {
    majorData?: MajorOptions[];
}): JSX.Element => {
    const [selectedMajor, setSelectedMajor] = useState<string>(
        majorData?.[0].slug || ''
    );
    return (
        <Container className="flex flex-col-reverse items-center py-4 md:pt-24 lg:py-16 md:gap-12 lg:gap-16 lg:h-screen md:flex-row">
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-extrabold whitespace-pre-line  md:text-4xl z-[1] leading-tight text-center md:text-left">
                    Belajar dari{' '}
                    <span className="text-[#7264EB]">dosen bermutu</span>,
                    bareng pelajar se-Indonesia
                </h1>
                <p className="mt-3 mb-8 text-sm text-center md:mt-6 md:mb-16 md:text-xl text-neutral-400 md:text-left">
                    Video, rangkuman, diskusi, latihan soal
                </p>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <select
                        name="major"
                        id="major-select"
                        value={selectedMajor}
                        onChange={(e) => setSelectedMajor(e.target.value)}
                        className="w-full shadow-md md:w-min lg:w-64 select select-bordered bg-neutral-900">
                        {majorData?.map((major) => (
                            <option key={major.slug} value={major.slug}>
                                {major.label}
                            </option>
                        ))}
                    </select>
                    <Button
                        variant="primary"
                        href={`/dashboard?recommendation=${selectedMajor}`}
                        className="flex items-center flex-none h-10 text-sm md:h-12 whitespace-nowrap lg:text-base"
                        eventName='Click "Cari Materi Gratis" Button'
                        eventPayload={{ 'Section Name': 'Hero' }}>
                        Cari Materi Gratis
                    </Button>
                </div>
                <div className="flex items-center justify-between gap-5 px-4 py-3 mt-6 md:mt-8 md:px-5 md:py-4 rounded-btn bg-black/50">
                    <p className="text-xs md:text-sm">
                        Beli paket belajar untuk{' '}
                        <strong>mengakses semua materi</strong> Gradient
                    </p>
                    <Button
                        href="#pricing"
                        variant="tertiary"
                        eventName='Click "Beli Paket" Button'
                        className="flex-none whitespace-nowrap !px-0 text-sm normal-case md:!px-1 md:text-base !text-accent-purple">
                        Beli Paket
                    </Button>
                </div>
            </div>
            <div className="-mx-4 -mb-8 md:mb-0">
                <Image
                    src={`${CDN_URL}/assets/hero-asset.png`}
                    priority
                    width={1440}
                    height={1633}
                />
            </div>
        </Container>
    );
};

export default RevampedHero;
