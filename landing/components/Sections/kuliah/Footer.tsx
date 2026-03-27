import Link from 'next/link';
import { Instagram, Mail, Phone, Youtube, Linkedin } from 'lucide-react';

const footerLinks = {
    tentangKami: {
        title: 'Tentang Kami',
        links: [
            { label: 'Tentang Gradient', href: '#' },
            { label: 'Karier', href: '#' },
            { label: 'Kontak Kami', href: '#' },
            { label: 'Testimoni', href: '#' }
        ]
    },
    panduan: {
        title: 'Panduan',
        links: [
            { label: 'Syarat & Ketentuan', href: '#' },
            { label: 'Kebijakan Privasi', href: '#' }
        ]
    },
    produkGradient: {
        title: 'Produk Gradient',
        links: [
            { label: 'Kelas', href: '#' },
            { label: 'Textbook Solution', href: '#' },
            { label: 'Astronotes', href: '#' },
            { label: 'Bank Soal', href: '#' },
            { label: 'Copilot AI', href: '#' },
            { label: 'Flashcard', href: '#' },
            { label: 'Quiz', href: '#' },
            { label: 'Diskusi', href: '#' }
        ]
    }
};

const contactInfo = [
    {
        icon: Instagram,
        label: '@gradient_idn',
        href: 'https://instagram.com/gradient_idn'
    },
    {
        icon: Mail,
        label: 'business@gradient.academy',
        href: 'mailto:business@gradient.academy'
    },
    {
        icon: Phone,
        label: '085179765182',
        href: 'https://wa.me/6285179765182'
    }
];

const TwitterIcon = ({ className }: { className?: string }): JSX.Element => {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
};

const TikTokIcon = ({ className }: { className?: string }): JSX.Element => {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
    );
};

const Footer = (): JSX.Element => {
    return (
        <footer className="w-full bg-graphite-800 pt-8 pb-6">
            <div className="max-w-[1280px] mx-auto px-6 md:px-[96px]">
                {/* Main Footer Content */}
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                    {/* Left: Navigation Links */}
                    <div className="flex flex-wrap gap-6">
                        {/* Tentang Kami */}
                        <div className="flex flex-col gap-3 w-[152px]">
                            <h4 className="text-white font-semibold text-base leading-[1.4]">
                                {footerLinks.tentangKami.title}
                            </h4>
                            <div className="flex flex-col gap-2">
                                {footerLinks.tentangKami.links.map(
                                    (link, index) => (
                                        <Link
                                            key={index}
                                            href={link.href}
                                            className="text-[#999] hover:text-white transition-colors text-sm leading-[1.6]">
                                            {link.label}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Panduan */}
                        <div className="flex flex-col gap-3 w-[152px]">
                            <h4 className="text-white font-semibold text-base leading-[1.4]">
                                {footerLinks.panduan.title}
                            </h4>
                            <div className="flex flex-col gap-2">
                                {footerLinks.panduan.links.map(
                                    (link, index) => (
                                        <Link
                                            key={index}
                                            href={link.href}
                                            className="text-[#999] hover:text-white transition-colors text-sm leading-[1.6]">
                                            {link.label}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Produk Gradient */}
                        <div className="flex flex-col gap-3">
                            <h4 className="text-white font-semibold text-base leading-[1.4]">
                                {footerLinks.produkGradient.title}
                            </h4>
                            <div className="flex flex-col gap-2">
                                {footerLinks.produkGradient.links.map(
                                    (link, index) => (
                                        <Link
                                            key={index}
                                            href={link.href}
                                            className="text-[#999] hover:text-white transition-colors text-sm leading-[1.6]">
                                            {link.label}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact + Brand */}
                    <div className="flex flex-col sm:flex-row gap-12">
                        {/* Punya Pertanyaan */}
                        <div className="flex flex-col gap-3">
                            <h4 className="text-white font-semibold text-base leading-[1.4]">
                                Punya Pertanyaan?
                            </h4>
                            <div className="flex flex-col gap-2">
                                {contactInfo.map((contact, index) => (
                                    <Link
                                        key={index}
                                        href={contact.href}
                                        className="inline-flex items-center gap-2 text-[#999] hover:text-white transition-colors text-sm leading-[1.6]">
                                        <contact.icon className="w-5 h-5 text-accent-purple" />
                                        {contact.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Brand Section */}
                        <div className="flex flex-col gap-6 w-full sm:w-[359px]">
                            {/* Brand Name */}
                            <h2 className="font-extrabold text-2xl text-white">
                                Gradient
                            </h2>

                            {/* Store Badges */}
                            <div className="flex gap-6">
                                {/* Google Play */}
                                <Link
                                    href="#"
                                    className="flex items-center gap-3 bg-accent-purple hover:bg-accent-purple/90 transition-colors rounded-xl px-3 py-2 h-[61px] w-[169px]">
                                    <svg
                                        className="w-7 h-8"
                                        viewBox="0 0 24 24"
                                        fill="currentColor">
                                        <path
                                            fill="#fff"
                                            d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.006 12l2.692-2.492zM5.864 2.658L16.8 9.09l-2.302 2.303-8.634-8.735z"
                                        />
                                    </svg>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/80 leading-[1.5]">
                                            Dapatkan di
                                        </span>
                                        <span className="text-base font-semibold text-white leading-tight">
                                            Google Play
                                        </span>
                                    </div>
                                </Link>

                                {/* App Store */}
                                <Link
                                    href="#"
                                    className="flex items-center gap-3 bg-accent-purple hover:bg-accent-purple/90 transition-colors rounded-xl px-3 py-2 h-[61px] w-[169px]">
                                    <svg
                                        className="w-7 h-8"
                                        viewBox="0 0 24 24"
                                        fill="currentColor">
                                        <path
                                            fill="#fff"
                                            d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                                        />
                                    </svg>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/80 leading-[1.5]">
                                            Dapatkan di
                                        </span>
                                        <span className="text-base font-semibold text-white leading-tight">
                                            App Store
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            {/* Office Address */}
                            <div className="flex flex-col gap-2">
                                <h4 className="text-white font-semibold text-base leading-[1.4]">
                                    Kantor Kami
                                </h4>
                                <div className="flex flex-col gap-1 text-[#999] text-xs leading-[1.6]">
                                    <p>
                                        Smesco SME Tower Kontrak Hukum Office
                                        Space Lt. 6
                                    </p>
                                    <p>
                                        Jl. Gatot Subroto Kav. 94, RT.11/RW.3,
                                        Kel. Pancoran, Kec. Pancoran, Kota
                                        Jakarta Selatan, Daerah Khusus Ibukota
                                        Jakarta 12780
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10 mt-12 mb-4" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Copyright */}
                    <p className="text-[#999] text-sm leading-[1.6]">
                        © 2024 Gradient Academy. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="#"
                            className="text-[#999] hover:text-white transition-colors"
                            aria-label="Twitter">
                            <TwitterIcon className="w-6 h-6" />
                        </Link>
                        <Link
                            href="#"
                            className="text-[#999] hover:text-white transition-colors"
                            aria-label="YouTube">
                            <Youtube className="w-6 h-6" />
                        </Link>
                        <Link
                            href="#"
                            className="text-[#999] hover:text-white transition-colors"
                            aria-label="Instagram">
                            <Instagram className="w-6 h-6" />
                        </Link>
                        <Link
                            href="#"
                            className="text-[#999] hover:text-white transition-colors"
                            aria-label="LinkedIn">
                            <Linkedin className="w-6 h-6" />
                        </Link>
                        <Link
                            href="#"
                            className="text-[#999] hover:text-white transition-colors"
                            aria-label="TikTok">
                            <TikTokIcon className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
