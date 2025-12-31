import Link from 'next/link';
import { Accordion } from '@base-ui/react/accordion';
import React, { Dispatch, SetStateAction } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import Image from 'next/image';
import { MATERI } from 'landing/constants/UTBK';
import { CDN_URL } from 'commons/constants';
import Button from 'commons/components/elements/Button';
import AccordionItem from './AccordionItem';

const MobileSidebar = ({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    configData?: ConfigResponse;
}): JSX.Element => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.35 }}
                    className="fixed z-[110] top-0 left-0 w-screen h-screen bg-black bg-opacity-90 flex flex-col gap-12"
                    style={{
                        backdropFilter: 'blur(32px)'
                    }}>
                    <header className="flex items-center justify-between w-full px-6 pt-6 md:px-8">
                        <span className="text-2xl font-bold cursor-pointer font-[Urbanist] text-neutral-50">
                            Gradient
                        </span>
                        <XIcon
                            size={24}
                            onClick={() => setOpen(false)}
                            className="text-[#ffffff]"
                        />
                    </header>
                    <div className="flex flex-col gap-8 md:gap-12 px-6 pb-6 flex-grow overflow-auto md:max-w-[738px] self-center w-full">
                        <Accordion.Root className="flex flex-col flex-grow md:flex-grow-0">
                            <AccordionItem
                                label={
                                    <div className="flex items-center gap-2">
                                        <span>Materi</span>
                                        <div className="bg-[#36236A] text-[10px] leading-normal text-white/80 font-bold py-1 px-2 rounded-lg">
                                            COMING SOON
                                        </div>
                                    </div>
                                }>
                                <>
                                    <div className="bg-[#1E1930] border border-[#36236A] flex gap-4 p-4 rounded-2xl mb-8">
                                        <div className="shrink-0">
                                            <Image
                                                src={`${CDN_URL}/assets/utbk/materi_coming_soon.svg`}
                                                alt=""
                                                width={24}
                                                height={24}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-sm font-semibold text-white">
                                                Semua materi sedang proses
                                                pengembangan
                                            </h4>
                                            <p className="text-sm text-[#DEDEDE]">
                                                Kami sedang bekerja keras untuk
                                                mempersiapkan konten materi
                                                berkualitas tinggi.
                                            </p>
                                        </div>
                                    </div>

                                    <ul className="flex flex-col gap-8 list-none p-0 md:pl-8">
                                        {MATERI.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    onClick={(event) =>
                                                        event.preventDefault()
                                                    }
                                                    className="cursor-not-allowed flex items-center gap-4">
                                                    <div className="flex-shrink-0 flex items-center justify-center rounded-full h-[48px] w-[48px] bg-[#333333]/60">
                                                        <img
                                                            src={`${CDN_URL}/assets/utbk/${item.icon}`}
                                                            alt={item.name}
                                                            className="flex-shrink-0 object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <h5 className="text-[#999999] font-semibold text-base leading-[140%]">
                                                            {item.name}
                                                        </h5>
                                                        <p className="text-[#666666] text-sm leading-[160%]">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            </AccordionItem>
                            <AccordionItem label="Try Out">
                                <div className="flex flex-col gap-8 md:gap-10">
                                    <section className="flex flex-col gap-4">
                                        <h4 className="text-xs leading-[125%] uppercase tracking-[2px] font-bold text-white">
                                            Gratis
                                        </h4>
                                        <Link
                                            href="/utbk/try-out?access_type=free"
                                            className="flex flex-col gap-1 p-3">
                                            <h5 className="text-white text-base leading-[140%] font-semibold">
                                                Try Out Gratis
                                            </h5>
                                            <p className="text-[#999999] text-sm leading-[160%] whitespace-nowrap">
                                                Coba format dan alur try out
                                                UTBK.
                                            </p>
                                        </Link>
                                    </section>
                                    <section className="flex flex-col gap-4">
                                        <h4
                                            className="text-xs leading-[125%] uppercase tracking-[2px] font-bold text-white"
                                            style={{
                                                background:
                                                    'linear-gradient(97.13deg, #D790DE 8.82%, #99B8DA 45.79%, #439CFB 91.57%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor:
                                                    'transparent',
                                                backgroundClip: 'text'
                                            }}>
                                            Khusus Member
                                        </h4>
                                        <Link
                                            href="/utbk/try-out?access_type=member"
                                            className="flex flex-col gap-1 p-3">
                                            <h5 className="text-white text-base leading-[140%] font-semibold">
                                                Try Out Harian
                                            </h5>
                                            <p className="text-[#999999] text-sm leading-[160%]">
                                                Latihan rutin soal UTBK setiap
                                                hari.
                                            </p>
                                        </Link>
                                        <Link
                                            href="/utbk/try-out?access_type=member"
                                            className="flex flex-col gap-1 p-3">
                                            <h5 className="text-white text-base leading-[140%] font-semibold">
                                                Try Out Mingguan
                                            </h5>
                                            <p className="text-[#999999] text-sm leading-[160%] whitespace-nowrap">
                                                Simulasi try out UTBK secara
                                                berkala.
                                            </p>
                                        </Link>
                                    </section>
                                </div>
                            </AccordionItem>
                            <AccordionItem
                                label="Prediksi PTN"
                                href="/utbk/prediksi-ptn"
                            />
                        </Accordion.Root>
                        <section className="flex flex-col md:flex-row md:justify-center md:max-w-[456px] w-full gap-4 md:self-center">
                            <Button
                                variant="secondary"
                                href="/masuk"
                                className="h-[52px] flex justify-center items-center"
                                linkClass="md:grow md:basis-1/2">
                                Masuk
                            </Button>
                            <Button
                                variant="primary"
                                href="/daftar"
                                className="h-[52px] flex justify-center items-center"
                                linkClass="md:grow md:basis-1/2">
                                Coba Gratis
                            </Button>
                        </section>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileSidebar;
