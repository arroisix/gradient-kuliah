import Instagram from 'commons/components/elements/Icons/Instagram';
import LinkedIn from 'commons/components/elements/Icons/LinkedIn';
import TikTok from 'commons/components/elements/Icons/TikTok';
import Twitter from 'commons/components/elements/Icons/Twitter';
import Youtube from 'commons/components/elements/Icons/Youtube';
import Link from 'next/link';
import { BsWhatsapp } from 'react-icons/bs';
import { FaInstagram } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import { MdMailOutline } from 'react-icons/md';
import moment from 'moment';
import Image from 'next/image';
import { CDN_URL } from 'commons/constants';

type FooterItemProps = {
    title: string;
    bodies: FooterBodyProps[];
};

type FooterBodyProps = {
    content: string;
    url: string;
    Icon?: IconType;
};

const ITEMS: FooterItemProps[] = [
    {
        title: 'Tentang Kami',
        bodies: [
            {
                content: 'Tentang Gradient',
                url: '/tentang-kami'
            },
            {
                content: 'Karier',
                url: '/karir'
            },
            {
                content: 'Kontak Kami',
                url: '/kontak-kami'
            },
            {
                content: 'Testimoni',
                url: '/testimoni'
            }
        ]
    },
    {
        title: 'Panduan',
        bodies: [
            {
                content: 'Syarat & Ketentuan',
                url: '/syarat-dan-ketentuan'
            },
            {
                content: 'Kebijakan Privasi',
                url: '/kebijakan-privasi'
            }
        ]
    },
    {
        title: 'Produk Gradient',
        bodies: [
            {
                content: 'Kelas',
                url: '/kelas'
            },
            {
                content: 'Textbook Solution',
                url: '/perpustakaan/textbook'
            },
            {
                content: 'Astronotes',
                url: '/perpustakaan/astronotes'
            },
            {
                content: 'Bank Soal',
                url: '/perpustakaan/bank-soal'
            },
            {
                content: 'Copilot AI',
                url: '/copilot'
            },
            {
                content: 'Flashcard',
                url: '/flashcard'
            },
            {
                content: 'Quiz',
                url: '/latihan'
            },
            {
                content: 'Diskusi',
                url: '/komunitas'
            }
        ]
    }
];

const CONTACTS: FooterBodyProps[] = [
    {
        content: '@gradient_idn',
        url: 'https://www.instagram.com/gradient_idn/',
        Icon: FaInstagram
    },
    {
        content: 'business@gradient.academy',
        url: 'https://mail.google.com/mail/u/0/?fs=1&to=business@gradient.academy&tf=cm',
        Icon: MdMailOutline
    },
    {
        content: '+6285179893859',
        url: 'https://wa.me/+6285179893859',
        Icon: BsWhatsapp
    }
];

type FooterSocialMediaProps = {
    Icon: () => JSX.Element;
    url: string;
};

const SOCIAL_MEDIAS: FooterSocialMediaProps[] = [
    // {
    //     Icon: AiFillFacebook,
    //     url: '/',
    //     className: 'text-[#4A9CEC]'
    // },
    {
        Icon: Twitter,
        url: 'https://x.com/gradient_idn?lang=en'
    },
    {
        Icon: Youtube,
        url: 'https://www.youtube.com/@gradient3012'
    },
    {
        Icon: Instagram,
        url: 'https://www.instagram.com/gradient_idn/'
    },
    {
        Icon: LinkedIn,
        url: 'https://www.linkedin.com/company/gradient-idn/'
    },
    {
        Icon: TikTok,
        url: 'https://www.tiktok.com/@gradientacademy'
    }
];

const Footer = (): JSX.Element => {
    const TITLE_BODY_GAP = 4;
    const PRODUCT_BODY_GAP = 3;
    const CONTACT_BODY_GAP = 2;
    const CURRENT_YEAR = moment().year();

    return (
        <footer
            id="footer"
            className="w-screen flex flex-col bg-[#121212] gap-8 lg:gap-12 px-6 md:px-12 xl:px-24 pt-6 md:pt-8 pb-5 md:pb-6">
            <div className="flex flex-col-reverse w-full gap-8 lg:flex-row lg:gap-0">
                <div className="flex flex-col w-full lg:flex-row gap-7 xl:gap-12">
                    {ITEMS.map((item) => (
                        <div
                            key={item.title}
                            className={`flex flex-col gap-${TITLE_BODY_GAP}`}>
                            <Title title={item.title} />
                            <div
                                className={`flex flex-col gap-${PRODUCT_BODY_GAP}`}>
                                {item.bodies.map((body) => (
                                    <Body
                                        key={body.content}
                                        content={body.content}
                                        url={body.url}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col-reverse w-full lg:flex-row gap-7 xl:gap-12 lg:justify-end">
                    <div className={`flex flex-col gap-${TITLE_BODY_GAP}`}>
                        <Title title="Punya Pertanyaan?" />
                        <div
                            className={`flex flex-col gap-${CONTACT_BODY_GAP}`}>
                            {CONTACTS.map((body) => (
                                <Body
                                    key={body.content}
                                    content={body.content}
                                    url={body.url}
                                    Icon={body.Icon}
                                />
                            ))}
                        </div>
                    </div>

                    <div
                        className={`flex flex-col gap-${TITLE_BODY_GAP} lg:max-w-[45%] xl:max-w-[50%]`}>
                        <div className="flex flex-col gap-4">
                            <span className="text-2xl font-extrabold text-white">
                                Gradient
                            </span>
                            <AppButtons />
                        </div>
                        <div
                            className={`flex flex-col gap-${CONTACT_BODY_GAP}`}>
                            <p className="font-sans text-sm font-bold text-white">
                                Kantor Kami
                            </p>
                            <div className="flex flex-col gap-1">
                                <span className="font-body text-sm text-[#BBBBBB]">
                                    Smesco SME Tower Kontrak Hukum Office Space
                                    Lt. 6
                                </span>
                                <span className="font-body text-sm text-[#BBBBBB]">
                                    Jl. Gatot Subroto Kav. 94, RT.11/RW.3, Kel.
                                    Pancoran, Kec. Pancoran, Kota Jakarta
                                    Selatan, Daerah Khusus Ibukota Jakarta 12780
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <hr className="border-[#666666]" />
                <div className="flex flex-col-reverse items-center justify-between gap-4 lg:flex-row lg:gap-0">
                    <span className="font-body text-sm text-[#BBBBBB] text-center lg:text-left">
                        {`© ${CURRENT_YEAR} Gradient Academy. All rights reserved.`}
                    </span>
                    <div className="flex flex-row items-center gap-4">
                        {SOCIAL_MEDIAS.map(({ Icon, url }, idx) => (
                            <SocialMedia
                                key={`social-media-${idx + 1}`}
                                Icon={Icon}
                                url={url}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

const Title = ({ title }: { title: string }): JSX.Element => {
    return <p className="font-sans font-bold text-white">{title}</p>;
};

const Body = ({ content, url, Icon }: FooterBodyProps): JSX.Element => {
    return (
        <Link
            href={url}
            className="flex items-center gap-2 font-body text-sm text-[#BBBBBB]"
            target={Icon ? '_blank' : '_self'}>
            {Icon && <Icon className="w-[18px] h-[18px] text-[#7264EB]" />}
            {content}
        </Link>
    );
};

const SocialMedia = ({ Icon, url }: FooterSocialMediaProps): JSX.Element => {
    return (
        <Link href={url}>
            <Icon />
        </Link>
    );
};

const AppButtons = (): JSX.Element => {
    return (
        <div className="flex items-center gap-4">
            <Link
                href="https://play.google.com/store/apps/details?id=com.gradient.academy"
                target="_blank"
                className="flex items-center gap-2 bg-[#5F2BCE] rounded-xl px-4 py-3 hover:opacity-80 transition-opacity">
                <Image
                    src={`${CDN_URL}/assets/play-store-logo.png`}
                    alt="Get it on Google Play"
                    width={20}
                    height={20}
                />
                <div className="flex flex-col">
                    <span className="text-xs text-white/80">Dapatkan di</span>
                    <span className="text-sm font-semibold text-white">
                        Google Play
                    </span>
                </div>
            </Link>
            {/*<Link*/}
            {/*    href="https://apps.apple.com/id/app/gradient-academy/id1607386289"*/}
            {/*    target="_blank"*/}
            {/*    className="flex items-center gap-2 bg-[#5F2BCE] rounded-xl px-4 py-3 hover:opacity-80 transition-opacity">*/}
            {/*    <Image*/}
            {/*        src={`${CDN_URL}/assets/apple-logo.png`}*/}
            {/*        alt="Download on the App Store"*/}
            {/*        width={16}*/}
            {/*        height={20}*/}
            {/*    />*/}
            {/*    <div className="flex flex-col">*/}
            {/*        <span className="text-xs text-white/80">Dapatkan di</span>*/}
            {/*        <span className="text-sm font-semibold text-white">*/}
            {/*            App Store*/}
            {/*        </span>*/}
            {/*    </div>*/}
            {/*</Link>*/}
        </div>
    );
};

export default Footer;
