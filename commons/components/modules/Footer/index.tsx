import Link from 'next/link';
import { FaLine, FaInstagram } from 'react-icons/fa';
import { MdCopyright, MdMailOutline } from 'react-icons/md';

const Footer = (): JSX.Element => {
    const thisYear = new Date().getFullYear();

    return (
        <footer className="w-full flex flex-col bg-[#121212] px-4 md:px-[7.5rem] py-8">
            <div className="w-full flex flex-col lg:flex-row">
                <div className="w-full flex flex-col items-center justify-center lg:items-start lg:justify-start">
                    <h1 className="font-bold text-3xl mb-4 font-[Urbanist]">
                        Gradient
                    </h1>
                    <Link href="/tentang-kami">
                        <span className="text-neutral-400 cursor-pointer">
                            Tentang Kami
                        </span>
                    </Link>
                    <Link href="/karir">
                        <span className="my-2 text-neutral-400 cursor-pointer">
                            Karir
                        </span>
                    </Link>
                </div>
                <div className="lg:w-1/4 w-full flex-col items-center justify-center">
                    <h1 className="font-bold text-xl mb-2 mt-2 lg:mb-4 lg:mt-0 text-neutral-400 text-center lg:text-left">
                        Punya pertanyaan
                    </h1>
                    <a
                        href="https://www.instagram.com/gradient_idn/"
                        target="_blank"
                        rel="noreferrer">
                        <div className="flex items-center justify-center  lg:justify-start text-neutral-400 cursor-pointer">
                            <FaInstagram className="mr-2" />
                            <span>gradient_idn</span>
                        </div>
                    </a>
                    <a
                        href="https://lin.ee/rroxNIp"
                        target="_blank"
                        rel="noreferrer">
                        <div className="flex items-center justify-center  lg:justify-start text-neutral-400 cursor-pointer">
                            <FaLine className="mr-2" />
                            <span>@875dxoje</span>
                        </div>
                    </a>
                    <a
                        href="mailto:business@gradient.academy"
                        target="_blank"
                        rel="noreferrer">
                        <div className="flex items-center justify-center  lg:justify-start text-neutral-400 cursor-pointer">
                            <MdMailOutline className="mr-2" />
                            <span>business@gradient.academy</span>
                        </div>
                    </a>
                </div>
            </div>
            <div className="w-full flex justify-center items-center mt-8 text-neutral-400">
                <span className="text-accent-violet mr-1">
                    Gradient Academy
                </span>
                <MdCopyright className="text-accent-violet" />
                <span className="text-accent-violet ml-1">{thisYear}</span>
            </div>
        </footer>
    );
};

export default Footer;
