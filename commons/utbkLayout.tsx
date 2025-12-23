import Link from 'next/link';
import Footer from './components/modules/Footer';
import { CDN_URL } from './constants';
import Button from './components/elements/Button';
import { ChevronDownIcon } from 'lucide-react';
import { FaArrowRight } from 'react-icons/fa';
import { NavigationMenu } from '@base-ui/react/navigation-menu';

interface LayoutProps {
    children?: JSX.Element;
}

function Layout({ children }: LayoutProps): JSX.Element {
    return (
        <div className="bg-black">
            <Navbar />
            {children}
            <Footer className="!bg-black" />
        </div>
    );
}

const solutions = [
    {
        name: 'Penalaran Kualitatif',
        description: 'Hubungan, pola, analisis teks pendek.',
        href: '#',
        icon: 'penalaran-kualitatif.svg'
    },
    {
        name: 'Pemahaman dan Penalaran Umum',
        description: 'Membaca, memahami konteks, dan evaluasi.',
        href: '#',
        icon: 'pemahaman-penalaran-umum.svg'
    },
    {
        name: 'Literasi Bahasa Indonesia',
        description: 'Makna konteks, struktur, inferensi dalam teks.',
        href: '#',
        icon: 'literasi-bahasa-indonesia.svg'
    },
    {
        name: 'Penalaran Matematis',
        description: 'Logika angka, problem solving, matematika dasar.',
        href: '#',
        icon: 'penalaran-matematis.svg'
    },
    {
        name: 'Pemahaman Bacaan dan Menulis',
        description: 'Membaca panjang dan menulis argumentatif.',
        href: '#',
        icon: 'pemahaman-bacaan.svg'
    },
    {
        name: 'Literasi Bahasa Inggris',
        description: 'Reading comprehension, grammar, vocabulary.',
        href: '#',
        icon: 'literasi-bahasa-inggris.svg'
    },
    {
        name: 'Penalaran Umum',
        description: 'Kemampuan analisis fakta dan logika umum.',
        href: '#',
        icon: 'penalaran-umum.svg'
    }
];

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
    href
}: {
    label: string;
    children?: JSX.Element;
    href?: string;
}): JSX.Element {
    return (
        <NavigationMenu.Item>
            {href ? (
                <Link
                    href={href}
                    className="flex items-center gap-1 text-white text-sm leading-[125%] font-semibold hover:text-[#B6A6F3] hover:bg-black hover:bg-opacity-30 px-3 py-2 rounded-lg">
                    {label}
                </Link>
            ) : (
                <NavigationMenu.Trigger className="flex items-center gap-1 text-white text-sm leading-[125%] font-semibold data-[popup-open]:text-[#B6A6F3] data-[popup-open]:bg-black data-[popup-open]:bg-opacity-30 px-3 py-2 rounded-lg">
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
    return (
        <header className="flex fixed top-0 z-50 w-full justify-center lg:mt-[10px]">
            <div
                className="flex justify-between items-center w-full px-8 bg-white bg-opacity-[3%] border-solid border-[1px] border-white border-opacity-[8%] rounded-full h-[60px] m-4 max-w-[1232px]"
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
                    <NavigationMenu.List className="relative flex gap-8 list-none p-0">
                        <NavigationMenuItem label="Materi">
                            <div
                                className="w-screen max-w-[889px] flex-auto overflow-hidden rounded-2xl bg-black bg-opacity-90"
                                style={{
                                    backdropFilter: 'blur(32px)'
                                }}>
                                <ul className="p-6 grid grid-cols-2 gap-x-8 gap-y-6 m-0 list-none">
                                    {solutions.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="flex gap-4">
                                                <div className="flex items-center justify-center rounded-full h-[48px] w-[48px] bg-[#333333]">
                                                    <img
                                                        src={`${CDN_URL}/assets/utbk/${item.icon}`}
                                                        alt={item.name}
                                                        className="flex-shrink-0 object-contain"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <h5 className="text-white font-semibold text-base leading-[140%]">
                                                        {item.name}
                                                    </h5>
                                                    <p className="text-[#999999] text-sm leading-[160%]">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                    <li className="flex justify-end items-center text-[#B6A6F3]">
                                        <Link
                                            className="font-semibold text-sm flex gap-1 items-center"
                                            href="/utbk/materi">
                                            Lihat Semua
                                            <FaArrowRight size={16} />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </NavigationMenuItem>

                        <NavigationMenuItem label="Try Out">
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
                                            href="/utbk/try-out?type=1"
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
                                            href="/utbk/try-out?type=2"
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
                                            href="/utbk/try-out?type=3"
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

                <button type="button" className="lg:hidden">
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
        </header>
    );
}

export default Layout;
