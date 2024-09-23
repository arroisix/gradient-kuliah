import { AUTHENTICATION_ROUTE, CDN_URL } from 'commons/constants';
import Image from 'next/image';
import React from 'react';
import Container from './Container';
import Button from 'commons/components/elements/Button';
import { useAuth } from 'authentication/contexts/AuthProvider';

const IndonesiaMapCTA = (): JSX.Element => {
    const { isAuthenticated } = useAuth();
    return (
        <Container
            className="flex flex-col items-center gap-6 md:gap-12 md:flex-row py-9 md:py-16"
            id="gradient-users">
            <div>
                <Image
                    src={`${CDN_URL}/assets/indonesia-asset.png`}
                    width={870}
                    height={339}
                    alt="indonesia-map"
                />
            </div>
            <div className="flex flex-col items-center gap-3 text-center md:py-4 md:gap-5 md:text-left md:items-start">
                <h2 className="text-xl font-extrabold leading-tight text-center whitespace-pre-line md:text-[1.75rem] md:text-left">
                    <span className="text-[#7264EB]">80.000+ pelajar</span> di
                    Indonesia menggunakan Gradient
                </h2>
                <p className="text-sm md:text-base text-neutral-400">
                    {isAuthenticated
                        ? 'Langganan untuk mengakses seluruh materi'
                        : 'Daftar untuk mengakses preview materi GRATIS'}
                </p>
                <Button
                    href={isAuthenticated ? '/langganan' : AUTHENTICATION_ROUTE}
                    className="mt-3 md:mt-4"
                    eventName='Click "Daftar Sekarang" Button'
                    variant="primary">
                    {isAuthenticated ? 'Langganan Sekarang' : 'Daftar Sekarang'}
                </Button>
            </div>
        </Container>
    );
};

export default IndonesiaMapCTA;
