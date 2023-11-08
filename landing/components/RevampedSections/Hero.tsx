import Button from 'commons/components/elements/Button';
import Image from 'next/image';
import React from 'react';
import Container from './Container';
import { CDN_URL } from 'commons/constants';

const RevampedHero = (): JSX.Element => {
    return (
        <Container className="flex flex-col-reverse items-center py-4 lg:py-16 lg:gap-16 lg:h-screen lg:flex-row">
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-extrabold whitespace-pre-line  lg:text-4xl z-[1] leading-tight text-center lg:text-left">
                    Belajar dari{' '}
                    <span className="text-[#7264EB]">dosen bermutu</span>,
                    bareng pelajar se-Indonesia
                </h1>
                <p className="mt-3 mb-8 text-sm text-center lg:mt-6 lg:mb-16 lg:text-xl text-neutral-300 lg:text-left">
                    Video, rangkuman, diskusi, latihan soal
                </p>
                <div className="flex flex-col items-center gap-4 lg:flex-row">
                    <select
                        name="major"
                        id="major-select"
                        className="w-full shadow-md lg:w-64 select select-bordered bg-neutral-900">
                        <option value="teknik">Teknik</option>
                        <option value="informatika">Informatika/SI</option>
                        <option value="mipa">MIPA</option>
                    </select>
                    <Button
                        variant="primary"
                        href="#pricing"
                        className="flex items-center flex-none h-10 text-sm lg:h-12 whitespace-nowrap lg:text-base"
                        eventName="Landing Page CTA"
                        eventPayload={{ 'Section Name': 'Hero' }}>
                        Cari Materi Gratis
                    </Button>
                </div>
                <div className="flex items-center justify-between px-4 py-3 mt-6 lg:mt-8 lg:px-5 lg:py-4 rounded-btn bg-black/50">
                    <p className="flex-1 text-xs">
                        Beli paket belajar untuk{' '}
                        <strong>mengakses semua materi</strong> Gradient
                    </p>
                    <Button
                        variant="custom"
                        className="flex-none !px-0 text-sm normal-case lg:!px-1 lg:text-base btn btn-ghost text-accent-purple">
                        Beli Paket
                    </Button>
                </div>
            </div>
            <div className="-mx-4 -mb-8">
                <Image
                    src={`${CDN_URL}/assets/hero-asset.png`}
                    loading="lazy"
                    width={1440}
                    height={1633}
                />
            </div>
        </Container>
    );
};

export default RevampedHero;
