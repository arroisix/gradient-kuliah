import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CDN_URL } from '../../../commons/constants';
import Container from './Container';

const InstallGradient = () => {
    return (
        <div className="bg-[#5F2BCE] w-full">
            <Container>
                <div className="md:flex md:items-center md:gap-12 pt-8 md:pt-2 lg:pb-0 lg:pt-0 overflow-hidden">
                    <div className="hidden md:block md:w-1/2 md:translate-y-8 lg:translate-y-2">
                        <Image
                            src={`${CDN_URL}/assets/landing-gradient-app-desktop.png`}
                            alt="Gradient App Desktop"
                            width={625}
                            height={376}
                            className="w-full h-auto"
                        />
                    </div>

                    <div className="flex flex-col items-center md:items-start text-white text-center md:text-start mb-8 md:mb-0 md:w-1/2">
                        <h2 className="lg:text-2xl text-xl font-bold mb-2 lg:mb-4">
                            Install Gradient Sekarang!
                        </h2>
                        <div className="flex items-center gap-2 mb-2 lg:mb-4">
                            <Image
                                src={`${CDN_URL}/assets/gradient-G-icon.png`}
                                alt="Gradient Icon"
                                width={24}
                                height={24}
                            />
                            <span className="font-bold">Gradient</span>
                            <span
                                className="flex items-center gap-2 py-1 px-3 rounded-full bg-gradient-to-r from-[#741F86] to-[#965084] via-[#A82C56] font-semibold text-xs text-white tooltip tooltip-right"
                                data-tip="Copilot AI gratis selama versi Beta!">
                                Baru
                            </span>
                        </div>
                        <p className="text-gray-200 text-sm lg:text-base mb-4 lg:mb-6">
                            Gradient versi mobile app hadir buat kamu! Belajar
                            menjadi mudah dengan akses semua fitur dilengkapi
                            notifikasi hanya dalam satu aplikasi
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="https://play.google.com/store/apps/details?id=com.gradient.academy"
                                target="_blank"
                                className="flex items-center gap-2 bg-[#333333] rounded-full px-4 py-2 hover:opacity-80 transition-opacity">
                                <Image
                                    src={`${CDN_URL}/assets/play-store-logo.png`}
                                    alt="Get it on Google Play"
                                    width={16}
                                    height={16}
                                />
                                <p className="text-[11px] lg:text-sm font-semibold">
                                    Google Play
                                </p>
                            </Link>
                            <Link
                                href="https://apps.apple.com/id/app/gradient/id6749671325"
                                target="_blank"
                                className="flex items-center gap-2 bg-[#333333] rounded-full px-4 py-2 hover:opacity-80 transition-opacity">
                                <Image
                                    src={`${CDN_URL}/assets/apple-logo.png`}
                                    alt="Download on the App Store"
                                    width={16}
                                    height={20}
                                />
                                <p className="text-sm font-medium">App Store</p>
                            </Link>
                        </div>
                    </div>

                    <div className="md:hidden flex translate-y-2 justify-center">
                        <Image
                            src={`${CDN_URL}/assets/landing-gradient-app-mobile.png`}
                            alt="Gradient App Mobile"
                            width={328}
                            height={170}
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default InstallGradient;
