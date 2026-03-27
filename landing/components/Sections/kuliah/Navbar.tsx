import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Accordion } from '@base-ui/react/accordion';
import { NavigationMenu } from '@base-ui/react/navigation-menu';

// Arrow SVG for dropdown indicator (same as UTBK)
const ArrowSvg = (): JSX.Element => (
    <svg
        width={21}
        height={15}
        viewBox="0 0 21 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <foreignObject x={-64} y={-64} width={149} height={142.73}>
            <div
                style={{
                    backdropFilter: 'blur(32px)',
                    clipPath: 'url(#bgblur_kuliah_arrow_clip)',
                    height: '100%',
                    width: '100%'
                }}
            />
        </foreignObject>
        <path
            d="M14.001 2.06555L21 14.7305H0L6.99903 2.06555C8.5208 -0.688124 12.4792 -0.688128 14.001 2.06555Z"
            fill="black"
            fillOpacity={0.9}
        />
        <defs>
            <clipPath
                id="bgblur_kuliah_arrow_clip"
                transform="translate(64 64)">
                <path d="M14.001 2.06555L21 14.7305H0L6.99903 2.06555C8.5208 -0.688124 12.4792 -0.688128 14.001 2.06555Z" />
            </clipPath>
        </defs>
    </svg>
);

// Content transition class for dropdown animation
const contentClassName =
    'transition-[opacity,transform,translate] duration-[var(--duration)] ease-[var(--easing)] ' +
    'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 ' +
    'data-[starting-style]:data-[activation-direction=left]:translate-x-[-50%] ' +
    'data-[starting-style]:data-[activation-direction=right]:translate-x-[50%] ' +
    'data-[ending-style]:data-[activation-direction=left]:translate-x-[50%] ' +
    'data-[ending-style]:data-[activation-direction=right]:translate-x-[-50%]';

const navLinks = [
    { label: 'Kelas', href: 'https://gradient.academy/kelas', hasDropdown: true },
    { label: 'Try Out', href: '#', hasDropdown: false },
    { label: 'Perpustakaan', href: '#', hasDropdown: false }
];

const kelasDropdownItems = [
    { label: 'MIPA', href: 'https://gradient.academy/kelas' },
    { label: 'Teknik', href: 'https://gradient.academy/kelas' },
    { label: 'Komputer', href: 'https://gradient.academy/kelas' },
    { label: 'FEB', href: 'https://gradient.academy/kelas' },
    { label: 'Psikologi', href: 'https://gradient.academy/kelas' },
    { label: 'Semua Kelas', href: 'https://gradient.academy/kelas' }
];

const productCards = [
    {
        id: 'kuliah',
        name: 'Gradient Kuliah',
        description:
            'Platform belajar untuk mahasiswa dengan video dan latihan soal lengkap.',
        logo: '/assets/kuliah/logo-gradient-kuliah.svg',
        href: '/',
        current: true
    },
    {
        id: 'utbk',
        name: 'Gradient UTBK',
        description:
            'Persiapan UTBK dengan materi lengkap dan tryout berkualitas.',
        logo: '/assets/kuliah/logo-gradient-utbk.svg',
        href: 'https://gradient.academy/utbk',
        current: false
    },
    {
        id: 'private',
        name: 'Gradient Private',
        description:
            'Les privat online dengan tutor berpengalaman dan fleksibel.',
        logo: '/assets/kuliah/logo-gradient-private.svg',
        href: '#',
        current: false
    }
];

const Navbar = (): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [showMobileProductDropdown, setShowMobileProductDropdown] =
        useState(false);
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
        setShowProductDropdown(true);
    };

    const handleMouseLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setShowProductDropdown(false);
        }, 150);
    };

    return (
        <>
            {/* Desktop Floating Pill Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 hidden lg:block">
                {/* Outer container with padding */}
                <div className="max-w-[1280px] mx-auto px-6 py-4">
                    {/* Inner pill navbar */}
                    <div
                        className="flex items-center justify-between px-8 py-3 rounded-full border border-white/[0.08]"
                        style={{
                            background: 'rgba(4, 4, 4, 0.23)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            boxShadow:
                                '0px 25px 50px -12px rgba(88, 28, 135, 0.1)'
                        }}>
                        {/* Logo with Product Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}>
                            <button className="relative flex items-center gap-2">
                                {/* Black bar background - always present, opacity changes on hover */}
                                <div
                                    className={`absolute -inset-x-3 -inset-y-2 bg-black rounded-full transition-opacity duration-200 ${
                                        showProductDropdown
                                            ? 'opacity-80'
                                            : 'opacity-0'
                                    }`}
                                />
                                <Image
                                    src="/assets/kuliah/gradient-logo-nav.svg"
                                    alt="Gradient"
                                    width={191}
                                    height={24}
                                    className="relative z-10"
                                />
                                <ChevronDown
                                    className={`relative z-10 w-4 h-4 text-accent-purple-light transition-transform duration-200 ${
                                        showProductDropdown ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {/* Product Dropdown */}
                            <div
                                className={`absolute top-full left-0 pt-4 transition-all duration-200 ease-out ${
                                    showProductDropdown
                                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                                        : 'opacity-0 -translate-y-2 pointer-events-none'
                                }`}>
                                <div
                                    className="w-[480px] p-4 rounded-2xl border border-white/[0.08]"
                                    style={{
                                        background: 'rgba(10, 10, 10, 0.98)',
                                        boxShadow:
                                            '0px 25px 50px -12px rgba(0, 0, 0, 0.5)'
                                    }}>
                                    <div className="flex flex-col gap-2">
                                        {productCards.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={product.href}
                                                className={`group flex items-center gap-4 p-3 rounded-xl transition-all duration-150 ${
                                                    product.current
                                                        ? 'bg-accent-purple/20 border border-accent-purple/30'
                                                        : 'hover:bg-white/5 border border-transparent'
                                                }`}>
                                                {/* Product Logo */}
                                                <div className="relative h-10 rounded-full bg-black flex items-center justify-center overflow-hidden shrink-0 px-3">
                                                    <Image
                                                        src={product.logo}
                                                        alt={product.name}
                                                        width={140}
                                                        height={24}
                                                        className="object-contain h-6"
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {product.name}
                                                    </span>
                                                    <p className="text-white/50 text-xs mt-0.5 leading-relaxed line-clamp-2">
                                                        {product.description}
                                                    </p>
                                                </div>

                                                {/* Check icon for current */}
                                                {product.current && (
                                                    <div className="w-5 h-5 rounded-full bg-accent-purple flex items-center justify-center shrink-0">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Center Navigation - using NavigationMenu like UTBK */}
                        <NavigationMenu.Root className="absolute left-1/2 -translate-x-1/2">
                            <NavigationMenu.List className="relative flex items-center gap-8 list-none p-0">
                                {/* Kelas with dropdown */}
                                <NavigationMenu.Item>
                                    <NavigationMenu.Trigger className="flex items-center gap-1 px-3 py-2 text-white text-sm font-semibold hover:text-accent-purple-light data-[popup-open]:text-accent-purple-light data-[popup-open]:bg-black data-[popup-open]:bg-opacity-30 rounded-lg transition-colors">
                                        Kelas
                                        <NavigationMenu.Icon className="transition-transform duration-200 ease-in-out data-[popup-open]:rotate-180">
                                            <ChevronDown className="w-4 h-4" />
                                        </NavigationMenu.Icon>
                                    </NavigationMenu.Trigger>
                                    <NavigationMenu.Content className={contentClassName}>
                                        <div
                                            className="w-[240px] flex-auto overflow-hidden rounded-2xl bg-black bg-opacity-90"
                                            style={{ backdropFilter: 'blur(32px)' }}>
                                            <div className="p-3 flex flex-col gap-1">
                                                {kelasDropdownItems.map((item, index) => (
                                                    <Link
                                                        key={index}
                                                        href={item.href}
                                                        className="px-3 py-2.5 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors">
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </NavigationMenu.Content>
                                </NavigationMenu.Item>

                                {/* Try Out - simple link */}
                                <NavigationMenu.Item>
                                    <Link
                                        href="#"
                                        className="flex items-center gap-1 px-3 py-2 text-white text-sm font-semibold hover:text-accent-purple-light hover:bg-black hover:bg-opacity-30 rounded-lg transition-colors">
                                        Try Out
                                    </Link>
                                </NavigationMenu.Item>

                                {/* Perpustakaan - simple link */}
                                <NavigationMenu.Item>
                                    <Link
                                        href="#"
                                        className="flex items-center gap-1 px-3 py-2 text-white text-sm font-semibold hover:text-accent-purple-light hover:bg-black hover:bg-opacity-30 rounded-lg transition-colors">
                                        Perpustakaan
                                    </Link>
                                </NavigationMenu.Item>
                            </NavigationMenu.List>

                            {/* Portal for dropdown positioning */}
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
                                    className="box-border h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)] transition-[top,left,right,bottom] duration-[var(--duration)] ease-[var(--easing)] before:absolute before:content-[''] data-[instant]:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5"
                                    style={{
                                        ['--duration' as string]: '0.35s',
                                        ['--easing' as string]: 'cubic-bezier(0.22, 1, 0.36, 1)'
                                    }}>
                                    <NavigationMenu.Popup className="data-[ending-style]:easing-[ease] relative h-[var(--popup-height)] origin-[var(--transform-origin)] transition-[opacity,transform,width,height,scale,translate] duration-[var(--duration)] ease-[var(--easing)] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[ending-style]:duration-150 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 w-[var(--popup-width)]">
                                        <NavigationMenu.Arrow
                                            className="flex transition-[left] duration-[var(--duration)] ease-[var(--easing)] data-[side=bottom]:top-0"
                                            style={{ transform: 'translateY(-100%)' }}>
                                            <ArrowSvg />
                                        </NavigationMenu.Arrow>
                                        <NavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
                                    </NavigationMenu.Popup>
                                </NavigationMenu.Positioner>
                            </NavigationMenu.Portal>
                        </NavigationMenu.Root>

                        {/* Right CTA Buttons */}
                        <div className="flex items-center gap-4">
                            <Link
                                href="#"
                                className="px-4 py-2 bg-graphite-700 text-white text-sm font-semibold rounded-full hover:bg-graphite-600 transition-colors">
                                Masuk
                            </Link>
                            <Link
                                href="#"
                                className="px-4 py-2 bg-accent-purple text-white text-sm font-semibold rounded-full hover:bg-accent-purple/90 transition-colors">
                                Coba Gratis
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden">
                <div className="px-4 py-3">
                    <div
                        className="flex items-center justify-between px-4 py-2.5 rounded-full border border-white/[0.08]"
                        style={{
                            background: 'rgba(4, 4, 4, 0.23)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            boxShadow:
                                '0px 25px 50px -12px rgba(88, 28, 135, 0.1)'
                        }}>
                        {/* Logo with Product Dropdown */}
                        <div className="relative">
                            <button
                                className="relative flex items-center gap-2"
                                onClick={() =>
                                    setShowMobileProductDropdown(
                                        !showMobileProductDropdown
                                    )
                                }>
                                {/* Black bar background - always present, opacity changes on tap */}
                                <div
                                    className={`absolute -inset-x-3 -inset-y-2 bg-black rounded-full transition-opacity duration-200 ${
                                        showMobileProductDropdown
                                            ? 'opacity-80'
                                            : 'opacity-0'
                                    }`}
                                />
                                <Image
                                    src="/assets/kuliah/gradient-logo-nav.svg"
                                    alt="Gradient"
                                    width={160}
                                    height={20}
                                    className="relative z-10"
                                />
                                <ChevronDown
                                    className={`relative z-10 w-4 h-4 text-accent-purple-light transition-transform duration-200 ${
                                        showMobileProductDropdown
                                            ? 'rotate-180'
                                            : ''
                                    }`}
                                />
                            </button>

                            {/* Mobile Product Dropdown */}
                            <div
                                className={`fixed left-4 right-4 top-[72px] transition-all duration-200 ease-out ${
                                    showMobileProductDropdown
                                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                                        : 'opacity-0 -translate-y-2 pointer-events-none'
                                }`}>
                                <div
                                    className="w-full p-4 rounded-2xl border border-white/[0.08]"
                                    style={{
                                        background: 'rgba(10, 10, 10, 0.98)',
                                        boxShadow:
                                            '0px 25px 50px -12px rgba(0, 0, 0, 0.5)'
                                    }}>
                                    <div className="flex flex-col gap-2">
                                        {productCards.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={product.href}
                                                className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                                                    product.current
                                                        ? 'bg-accent-purple/20'
                                                        : 'hover:bg-white/5'
                                                }`}
                                                onClick={() =>
                                                    setShowMobileProductDropdown(
                                                        false
                                                    )
                                                }>
                                                <div className="h-10 rounded-full bg-black flex items-center justify-center overflow-hidden px-3 shrink-0">
                                                    <Image
                                                        src={product.logo}
                                                        alt={product.name}
                                                        width={120}
                                                        height={22}
                                                        className="object-contain h-[22px]"
                                                    />
                                                </div>
                                                <span className="text-white text-sm font-medium flex-1">
                                                    {product.name}
                                                </span>
                                                {product.current && (
                                                    <Check className="w-5 h-5 text-accent-purple shrink-0" />
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="text-white p-1"
                            onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Click outside to close mobile product dropdown */}
                {showMobileProductDropdown && (
                    <div
                        className="fixed inset-0 z-[-1]"
                        onClick={() => setShowMobileProductDropdown(false)}
                    />
                )}

            </nav>

            {/* Full-screen Mobile Menu (UTBK-style) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.35 }}
                        className="fixed z-[110] top-0 left-0 w-screen h-screen bg-black bg-opacity-90 flex flex-col gap-8 lg:hidden"
                        style={{
                            backdropFilter: 'blur(32px)',
                            WebkitBackdropFilter: 'blur(32px)'
                        }}>
                        {/* Header */}
                        <header className="flex items-center justify-between w-full px-6 pt-6">
                            <span className="text-2xl font-bold cursor-pointer text-white">
                                Gradient
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white p-1">
                                <X size={24} />
                            </button>
                        </header>

                        {/* Menu Content */}
                        <div className="flex flex-col gap-8 px-6 pb-6 flex-grow overflow-auto">
                            <Accordion.Root className="flex flex-col flex-grow">
                                {/* Kelas */}
                                <Accordion.Item className="border-b border-white/10">
                                    <Accordion.Header>
                                        <Accordion.Trigger className="group flex items-center w-full text-white h-[68px]">
                                            <span className="flex-grow text-left text-xl font-bold">
                                                Kelas
                                            </span>
                                            <ChevronDown
                                                size={20}
                                                className="transition-transform duration-200 group-data-[panel-open]:rotate-180 group-data-[panel-open]:text-accent-purple-light"
                                            />
                                        </Accordion.Trigger>
                                        <Accordion.Panel className="pb-4">
                                            <div className="flex flex-col gap-1">
                                                {kelasDropdownItems.map((item, index) => (
                                                    <Link
                                                        key={index}
                                                        href={item.href}
                                                        className="p-3 rounded-lg hover:bg-white/5 text-white text-base font-semibold"
                                                        onClick={() => setIsOpen(false)}>
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Header>
                                </Accordion.Item>

                                {/* Try Out */}
                                <Accordion.Item className="border-b border-white/10">
                                    <Accordion.Header>
                                        <Accordion.Trigger className="group flex items-center w-full text-white h-[68px]">
                                            <span className="flex-grow text-left text-xl font-bold">
                                                Try Out
                                            </span>
                                            <ChevronDown
                                                size={20}
                                                className="transition-transform duration-200 group-data-[panel-open]:rotate-180 group-data-[panel-open]:text-accent-purple-light"
                                            />
                                        </Accordion.Trigger>
                                        <Accordion.Panel className="pb-4">
                                            <div className="flex flex-col gap-2">
                                                <Link
                                                    href="#"
                                                    className="flex flex-col gap-1 p-3 rounded-lg hover:bg-white/5"
                                                    onClick={() => setIsOpen(false)}>
                                                    <span className="text-white text-base font-semibold">
                                                        Try Out UTS
                                                    </span>
                                                    <span className="text-white/50 text-sm">
                                                        Latihan soal Ujian Tengah Semester
                                                    </span>
                                                </Link>
                                                <Link
                                                    href="#"
                                                    className="flex flex-col gap-1 p-3 rounded-lg hover:bg-white/5"
                                                    onClick={() => setIsOpen(false)}>
                                                    <span className="text-white text-base font-semibold">
                                                        Try Out UAS
                                                    </span>
                                                    <span className="text-white/50 text-sm">
                                                        Latihan soal Ujian Akhir Semester
                                                    </span>
                                                </Link>
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Header>
                                </Accordion.Item>

                                {/* Perpustakaan - no dropdown */}
                                <Link
                                    href="#"
                                    className="flex items-center w-full text-white h-[68px] border-b border-white/10"
                                    onClick={() => setIsOpen(false)}>
                                    <span className="flex-grow text-left text-xl font-bold">
                                        Perpustakaan
                                    </span>
                                </Link>
                            </Accordion.Root>

                            {/* CTA Buttons */}
                            <div className="flex flex-col gap-3 mt-auto">
                                <Link
                                    href="#"
                                    className="h-[52px] flex justify-center items-center bg-graphite-700 text-white text-base font-semibold rounded-full"
                                    onClick={() => setIsOpen(false)}>
                                    Masuk
                                </Link>
                                <Link
                                    href="#"
                                    className="h-[52px] flex justify-center items-center bg-accent-purple text-white text-base font-semibold rounded-full"
                                    onClick={() => setIsOpen(false)}>
                                    Coba Gratis
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
