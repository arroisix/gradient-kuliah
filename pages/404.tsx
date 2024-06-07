import Layout from 'commons/layout';
import Features from '../landing/components/Sections/Features';
import { CDN_URL } from '../commons/constants';
import Image from 'next/image';
import React from 'react';

const NotFound = (): JSX.Element => {
    return (
        <Layout isFullBlackBackground>
            <div className="flex flex-col justify-center min-h-screen pt-12 md:pt-14 ">
                <div className="flex flex-col items-center gap-10 md:gap-12 pt-12">
                    <div className="relative w-full max-w-96 md:max-w-3xl">
                        <div className="w-full h-0 pb-[40%]">
                            <Image
                                src={`${CDN_URL}/assets/404_desktop.png`}
                                priority
                                alt="404"
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 px-4 md:px-8">
                        <h1 className="text-xl font-sans font-bold text-center">
                            Limit fungsi ini{' '}
                            <span className="text-[#7264EB]">tidak ada</span>,
                            seperti halaman yang kamu cari
                        </h1>
                        <p className="text-base text-[#999999] font-body text-center">
                            Maaf, kami tidak bisa menemukan halaman yang kamu
                            cari
                        </p>
                    </div>
                </div>
                <Features
                    title={'Mending kamu eksplor fitur-fitur Gradient berikut'}
                />
            </div>
        </Layout>
    );
};

export default NotFound;
