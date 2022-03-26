import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { MdCopyright } from 'react-icons/md';

const Footer = (): JSX.Element => {
    return (
        <footer className="w-full flex flex-col bg-[#121212] px-4 md:px-[7.5rem] py-8">
            <div className="w-full flex flex-col lg:flex-row">
                <div className="w-full flex flex-col items-center justify-center lg:items-start lg:justify-start">
                    <h1 className="font-bold text-3xl mb-4">Gradient</h1>
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
                    <Link href="https://api.whatsapp.com/send?phone=081310028280">
                        <div className="flex items-center justify-center lg:items-start lg:justify-start text-neutral-400 cursor-pointer">
                            <FaWhatsapp className="mr-2" />
                            <span>081310028280</span>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="w-full flex justify-center items-center mt-8">
                <span className="text-accent-violet mr-1">
                    Gradient Academy
                </span>
                <MdCopyright className="text-accent-violet" />
                <span className="text-accent-violet ml-1">2022</span>
            </div>
        </footer>
    );
};

export default Footer;
