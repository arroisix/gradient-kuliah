import Link from 'next/link';
import Footer from './components/modules/Footer';
import { CDN_URL } from './constants';
import Button from './components/elements/Button';
import { ChevronDownIcon } from 'lucide-react';
import { FaArrowRight } from 'react-icons/fa';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { Accordion } from '@base-ui/react/accordion';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface LayoutProps {
    children?: JSX.Element;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
    return (
        <div className="bg-black">
            <Navbar />
            {children}
            <Footer className="!bg-black md:mt-7" isUtbk />
        </div>
    );
}

const MATERI = [
    {
        name: 'Penalaran Kuantitatif',
        description: 'Hubungan, pola, analisis teks pendek.',
        href: '#',
        icon: 'penalaran-kualitatif.svg'
    },
    {
        name: 'Pemahaman Bacaan dan Menulis',
        description: 'Membaca panjang dan menulis argumentatif.',
        href: '#',
        icon: 'pemahaman-bacaan.svg'
    },
    {
        name: 'Penalaran Matematika',
        description: 'Logika angka, problem solving, matematika dasar.',
        href: '#',
        icon: 'penalaran-matematis.svg'
    },
    {
        name: 'Pengetahuan dan Pemahaman Umum',
        description: 'Membaca, memahami konteks, dan evaluasi.',
        href: '#',
        icon: 'pemahaman-penalaran-umum.svg'
    },
    {
        name: 'Penalaran Umum',
        description: 'Kemampuan analisis fakta dan logika umum.',
        href: '#',
        icon: 'penalaran-umum.svg'
    },
    {
        name: 'Literasi Bahasa Indonesia',
        description: 'Makna konteks, struktur, inferensi dalam teks.',
        href: '#',
        icon: 'literasi-bahasa-indonesia.svg'
    },
    {
        name: 'Literasi Bahasa Inggris',
        description: 'Reading comprehension, grammar, vocabulary.',
        href: '#',
        icon: 'literasi-bahasa-inggris.svg'
    }
];

function ArrowRight(props: React.ComponentProps<'svg'>): JSX.Element {
    return (
        <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path
                d="M15 5C14.4181 5 14 5.50476 14 6C14 6.25443 14.0865 6.48001 14.2881 6.68164L17.7539 10.1465L18.6074 11H3C2.44814 11 2 11.4481 2 12C2 12.5519 2.44814 13 3 13H18.6074L17.7539 13.8535L14.2881 17.3184C14.0865 17.52 14 17.7456 14 18C14 18.4954 14.4175 19 15 19C15.2626 19 15.4831 18.9099 15.6807 18.7119L15.6816 18.7109L21.6621 12.7314C21.7911 12.6024 21.8662 12.5127 21.916 12.416C21.9617 12.3273 22 12.2047 22 12C22 11.8089 21.9581 11.6769 21.9033 11.5742C21.845 11.4649 21.7623 11.3688 21.6504 11.2568L15.6816 5.28809H15.6807C15.4831 5.09005 15.2626 5 15 5ZM22.4893 11.8057H22.4883H22.4893ZM13.668 6.67969H13.667H13.668Z"
                fill="white"
            />
        </svg>
    );
}

function AccordionItem({
    label,
    children,
    href
}: {
    label: string | JSX.Element;
    href?: string;
    children?: JSX.Element;
}): JSX.Element {
    let header;
    if (href) {
        header = (
            <div className="flex items-center w-full text-white h-[78px] md:h-[86px]">
                <span className="flex-grow text-left text-2xl md:text-3xl leading-[125%] font-bold">
                    {label}
                </span>
                <ArrowRight />
            </div>
        );
    } else {
        header = (
            <Accordion.Trigger className="group flex items-center w-full text-white h-[78px] md:h-[86px]">
                <span className="flex-grow text-left text-2xl md:text-3xl leading-[125%] font-bold">
                    {label}
                </span>
                <ChevronDownIcon
                    size={24}
                    className="group-data-[panel-open]:rotate-180 group-data-[panel-open]:text-[#B6A6F3]"
                />
            </Accordion.Trigger>
        );
    }

    const body = (
        <Accordion.Header>
            {header}
            {children ? (
                <Accordion.Panel className="pb-6 pt-2 md:pt-4">
                    {children}
                </Accordion.Panel>
            ) : null}
        </Accordion.Header>
    );

    return (
        <Accordion.Item className="border-b-[1px] border-white border-opacity-10">
            {href ? <Link href={href}>{body}</Link> : body}
        </Accordion.Item>
    );
}

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
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
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

const contentClassName =
    'transition-[opacity,transform,translate] duration-[var(--duration)] ease-[var(--easing)] ' +
    'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ' +
    'data-[starting-style]:data-[activation-direction=left]:translate-x-[-50%] ' +
    'data-[starting-style]:data-[activation-direction=right]:translate-x-[50%] ' +
    'data-[ending-style]:data-[activation-direction=left]:translate-x-[50%] ' +
    'data-[ending-style]:data-[activation-direction=right]:translate-x-[-50%]';

function ArrowSvg(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width={21}
            height={15}
            viewBox="0 0 21 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <foreignObject x={-64} y={-64} width={149} height={142.73}>
                <div
                    style={{
                        backdropFilter: 'blur(32px)',
                        clipPath: 'url(#bgblur_0_40007249_168575_clip_path)',
                        height: '100%',
                        width: '100%'
                    }}
                />
            </foreignObject>
            <path
                data-figma-bg-blur-radius={64}
                d="M14.001 2.06555L21 14.7305H0L6.99903 2.06555C8.5208 -0.688124 12.4792 -0.688128 14.001 2.06555Z"
                fill="black"
                fillOpacity={0.9}
            />
            <defs>
                <clipPath
                    id="bgblur_0_40007249_168575_clip_path"
                    transform="translate(64 64)">
                    <path d="M14.001 2.06555L21 14.7305H0L6.99903 2.06555C8.5208 -0.688124 12.4792 -0.688128 14.001 2.06555Z" />
                </clipPath>
            </defs>
        </svg>
    );
}

function NavigationMenuItem({
    label,
    children,
    href,
    isActive = false
}: {
    label: string | JSX.Element;
    children?: JSX.Element;
    href?: string;
    isActive?: boolean;
}): JSX.Element {
    return (
        <NavigationMenu.Item>
            {href ? (
                <Link
                    href={href}
                    className={`${
                        isActive ? 'text-[#B6A6F3]' : 'text-white'
                    } flex items-center gap-1 text-sm leading-[125%] font-semibold hover:text-[#B6A6F3] hover:bg-black hover:bg-opacity-30 px-3 py-2 rounded-lg`}>
                    {label}
                </Link>
            ) : (
                <NavigationMenu.Trigger
                    className={`${
                        isActive ? 'text-[#B6A6F3]' : 'text-white'
                    } flex items-center gap-1 text-sm leading-[125%] font-semibold data-[popup-open]:text-[#B6A6F3] data-[popup-open]:bg-black data-[popup-open]:bg-opacity-30 px-3 py-2 rounded-lg`}>
                    {label}
                    <NavigationMenu.Icon className="transition-transform duration-200 ease-in-out data-[popup-open]:rotate-180">
                        <ChevronDownIcon size={16} />
                    </NavigationMenu.Icon>
                </NavigationMenu.Trigger>
            )}

            {children ? (
                <NavigationMenu.Content className={contentClassName}>
                    {children}
                </NavigationMenu.Content>
            ) : null}
        </NavigationMenu.Item>
    );
}

function Navbar(): JSX.Element {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const router = useRouter();

    return (
        <header className="flex fixed top-0 z-[9999] w-full justify-center lg:mt-[10px]">
            <div
                className="flex justify-between items-center w-full px-8 bg-white bg-opacity-[3%] md:bg-[#040404] md:bg-opacity-[23%] border-solid border-[1px] border-white border-opacity-[8%] rounded-full h-[60px] m-4 max-w-[1232px]"
                style={{
                    boxShadow: '0px 25px 50px -12px rgba(88, 28, 135, 0.1)',
                    backdropFilter: 'blur(8px)'
                }}>
                <Link
                    href="/utbk"
                    className="text-2xl leading-6 tracking-[0.08px] font-bold font-[Urbanist] text-[#E9E9E9]">
                    Gradient
                </Link>

                <NavigationMenu.Root className="hidden lg:block absolute left-1/2 -translate-x-1/2 transform">
                    <NavigationMenu.List className="relative flex items-center gap-8 list-none p-0">
                        <NavigationMenuItem
                            label={
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#36236A] text-[10px] text-white/80 font-bold py-1 px-2 rounded-lg">
                                        COMING SOON
                                    </div>
                                    <span>Materi</span>
                                </div>
                            }>
                            <div
                                className="w-screen max-w-[889px] flex-auto overflow-hidden rounded-2xl bg-black bg-opacity-90"
                                style={{
                                    backdropFilter: 'blur(32px)'
                                }}>
                                <div className="bg-[#1E1930] border-b border-b-[#36236A] flex items-center gap-4 p-4">
                                    <Image
                                        src={`${CDN_URL}/assets/utbk/materi_coming_soon.svg`}
                                        alt=""
                                        width={24}
                                        height={24}
                                    />

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
                                <ul className="p-6 grid grid-cols-2 gap-x-8 gap-y-6 m-0 list-none">
                                    {MATERI.map((item, i) => (
                                        <li
                                            key={item.name}
                                            style={{
                                                order:
                                                    i === MATERI.length - 1
                                                        ? 8
                                                        : undefined
                                            }}>
                                            <Link
                                                href={item.href}
                                                onClick={(event) =>
                                                    event.preventDefault()
                                                }
                                                className="cursor-not-allowed flex items-center gap-4">
                                                <div className="flex items-center justify-center rounded-full h-[48px] w-[48px] bg-[#333333]/60">
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
                                    {/* <li className="flex justify-end items-center text-[#B6A6F3]">
                                        <Link
                                            className="font-semibold text-sm flex gap-1 items-center"
                                            href="/utbk/materi">
                                            Lihat Semua
                                            <FaArrowRight size={16} />
                                        </Link>
                                    </li> */}
                                </ul>
                            </div>
                        </NavigationMenuItem>

                        <NavigationMenuItem
                            isActive={router.pathname.includes('/utbk/try-out')}
                            label="Try Out">
                            <div
                                className="w-screen max-w-[618px] flex-auto overflow-hidden rounded-2xl bg-black bg-opacity-90"
                                style={{
                                    backdropFilter: 'blur(32px)'
                                }}>
                                <div className="p-6 gap-10 flex">
                                    <section className="flex flex-col gap-4">
                                        <h4 className="text-xs leading-[125%] uppercase tracking-[2px] font-bold text-white px-3">
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
                                        <div className="flex h-full items-end">
                                            <Link
                                                href="/utbk/try-out"
                                                className="mb-5 text-sm leading-[125%] text-[#B6A6F3] font-semibold flex items-center gap-1 px-3">
                                                Lihat Semua
                                                <FaArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </section>
                                    <section className="flex flex-col gap-4">
                                        <h4
                                            className="text-xs leading-[125%] uppercase tracking-[2px] font-bold text-white px-3"
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
                            </div>
                        </NavigationMenuItem>

                        <NavigationMenuItem
                            label="Prediksi PTN"
                            href="/utbk/prediksi-ptn"
                        />
                    </NavigationMenu.List>

                    <NavigationMenu.Portal>
                        <NavigationMenu.Positioner
                            sideOffset={32}
                            collisionPadding={{
                                top: 5,
                                bottom: 5,
                                left: 20,
                                right: 20
                            }}
                            collisionAvoidance={{ side: 'none' }}
                            className="box-border h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)] transition-[top,left,right,bottom] duration-[var(--duration)] ease-[var(--easing)] before:absolute before:content-[''] data-[instant]:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5 data-[side=left]:before:top-0 data-[side=left]:before:right-[-10px] data-[side=left]:before:bottom-0 data-[side=left]:before:w-2.5 data-[side=right]:before:top-0 data-[side=right]:before:bottom-0 data-[side=right]:before:left-[-10px] data-[side=right]:before:w-2.5 data-[side=top]:before:right-0 data-[side=top]:before:bottom-[-10px] data-[side=top]:before:left-0 data-[side=top]:before:h-2.5"
                            style={{
                                ['--duration' as string]: '0.35s',
                                ['--easing' as string]:
                                    'cubic-bezier(0.22, 1, 0.36, 1)'
                            }}>
                            <NavigationMenu.Popup className="data-[ending-style]:easing-[ease] relative h-[var(--popup-height)] origin-[var(--transform-origin)] transition-[opacity,transform,width,height,scale,translate] duration-[var(--duration)] ease-[var(--easing)] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[ending-style]:duration-150 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 w-[var(--popup-width)] xs:w-[var(--popup-width)]">
                                <NavigationMenu.Arrow
                                    className="flex transition-[left] duration-[var(--duration)] ease-[var(--easing)] data-[side=bottom]:top-0 data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180"
                                    style={{ transform: 'translateY(-100%)' }}>
                                    <ArrowSvg />
                                </NavigationMenu.Arrow>
                                <NavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
                            </NavigationMenu.Popup>
                        </NavigationMenu.Positioner>
                    </NavigationMenu.Portal>
                </NavigationMenu.Root>

                <button
                    type="button"
                    className="lg:hidden"
                    onClick={() => setShowMobileMenu(true)}>
                    <img
                        src={`${CDN_URL}/assets/utbk/hamburger.svg`}
                        alt="Menu"
                        height={24}
                        width={24}
                    />
                </button>

                <section className="gap-4 h-[34px] hidden lg:flex">
                    <Button
                        variant="secondary"
                        href="/masuk"
                        className="text-sm leading-[125%] !px-4 h-full">
                        Masuk
                    </Button>
                    <Button
                        variant="primary"
                        href="/daftar"
                        className="text-sm leading-[125%] !px-4 h-full">
                        Coba Gratis
                    </Button>
                </section>
            </div>

            <MobileSidebar open={showMobileMenu} setOpen={setShowMobileMenu} />
        </header>
    );
}
