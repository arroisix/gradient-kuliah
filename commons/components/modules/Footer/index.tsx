import { useFeatureIsOn } from '@growthbook/growthbook-react';
import Link from 'next/link';
import { FaLine, FaInstagram } from 'react-icons/fa';
import { MdCopyright, MdMailOutline } from 'react-icons/md';

const Footer = (): JSX.Element => {
    const thisYear = new Date().getFullYear();
    const isLegalPagesOn = useFeatureIsOn<GrowthbookFeatures>('legal-pages');

    return (
        <footer className="w-full flex flex-col bg-[#121212] px-4 md:px-[7.5rem] py-8">
            <div className="flex flex-col w-full lg:flex-row">
                <div className="flex flex-col items-center justify-center w-full lg:items-start lg:justify-start">
                    <span className="font-bold text-3xl mb-4 font-[Urbanist]">
                        Gradient
                    </span>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <Link
                            href="/tentang-kami"
                            className="cursor-pointer text-neutral-400">
                            Tentang Kami
                        </Link>
                        {isLegalPagesOn ? (
                            <Link
                                href="/syarat-dan-ketentuan"
                                className="cursor-pointer text-neutral-400">
                                Syarat &amp; Ketentuan
                            </Link>
                        ) : (
                            <div />
                        )}
                        <Link
                            href="/karir"
                            className="cursor-pointer text-neutral-400">
                            Karir
                        </Link>
                        {isLegalPagesOn && (
                            <Link
                                href="/kebijakan-privasi"
                                className="cursor-pointer text-neutral-400">
                                Privasi
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex-col items-center justify-center w-full lg:w-1/4">
                    <h4 className="mt-2 mb-2 text-xl font-bold text-center lg:mb-4 lg:mt-0 text-neutral-400 lg:text-left">
                        Punya pertanyaan
                    </h4>
                    <a
                        href="https://www.instagram.com/gradient_idn/"
                        target="_blank"
                        rel="noreferrer">
                        <div className="flex items-center justify-center cursor-pointer lg:justify-start text-neutral-400">
                            <FaInstagram className="mr-2" />
                            <span>gradient_idn</span>
                        </div>
                    </a>
                    <a
                        href="https://lin.ee/rroxNIp"
                        target="_blank"
                        rel="noreferrer">
                        <div className="flex items-center justify-center cursor-pointer lg:justify-start text-neutral-400">
                            <FaLine className="mr-2" />
                            <span>@875dxoje</span>
                        </div>
                    </a>
                    <a
                        href="mailto:business@gradient.academy"
                        target="_blank"
                        rel="noreferrer">
                        <div className="flex items-center justify-center cursor-pointer lg:justify-start text-neutral-400">
                            <MdMailOutline className="mr-2" />
                            <span>business@gradient.academy</span>
                        </div>
                    </a>
                </div>
            </div>
            <div className="flex items-center justify-center w-full mt-8 text-neutral-400">
                <span className="mr-1 text-accent-violet">
                    Gradient Academy
                </span>
                <MdCopyright className="text-accent-violet" />
                <span className="ml-1 text-accent-violet">{thisYear}</span>
            </div>
        </footer>
    );
};

export default Footer;
