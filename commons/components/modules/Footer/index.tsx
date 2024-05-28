import { cn } from 'commons/utils';
import Link from 'next/link';
import {
    AiFillInstagram,
    AiFillLinkedin,
    AiFillYoutube,
} from 'react-icons/ai';
import { BsTwitterX, BsWhatsapp } from 'react-icons/bs';
import { FaInstagram } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import { MdMailOutline } from 'react-icons/md';
import { RiTiktokFill } from 'react-icons/ri';

type FooterItemProps = {
    title: string;
    bodies: {
        title: string;
        url: string;
    }[];
};

const ITEMS: FooterItemProps[] = [
    {
        title: 'Tentang Kami',
        bodies: [
            {
                title: 'Tentang Gradient',
                url: '/tentang-kami'
            },
            {
                title: 'Karier',
                url: '/karir'
            }
        ]
    },
    {
        title: 'Panduan',
        bodies: [
            {
                title: 'Syarat & Ketentuan',
                url: '/syarat-dan-ketentuan'
            },
            {
                title: 'Kebijakan Privasi',
                url: '/kebijakan-privasi'
            }
        ]
    },
    {
        title: 'Produk Gradient',
        bodies: [
            {
                title: 'Kelas',
                url: '/kelas'
            },
            {
                title: 'Textbook Solution',
                url: '/astronotes?tab=text-book'
            },
            {
                title: 'Astronotes',
                url: '/astronotes?tab=astronotes'
            },
            {
                title: 'Bank Soal',
                url: '/astronotes?tab=bank-soal'
            },
            {
                title: 'Komunitas',
                url: '/komunitas'
            }
        ]
    }
];

type FooterSocialMediaProps = {
    Icon: IconType;
    url: string;
    className?: string;
};

const SOCIAL_MEDIAS: FooterSocialMediaProps[] = [
    // {
    //     Icon: AiFillFacebook,
    //     url: '/',
    //     className: 'text-[#4A9CEC]'
    // },
    {
        Icon: BsTwitterX,
        url: 'https://x.com/gradient_idn?lang=en',
        className: 'text-white'
    },
    {
        Icon: AiFillYoutube,
        url: 'https://www.youtube.com/@gradient3012',
        className: 'text-[#F50000]'
    },
    {
        Icon: AiFillInstagram,
        url: 'https://www.instagram.com/gradient_idn/',
        className: 'text-[#C81762]'
    },
    {
        Icon: AiFillLinkedin,
        url: 'https://www.linkedin.com/company/gradient-idn/',
        className: 'text-[#1364A8]'
    },
    {
        Icon: RiTiktokFill,
        url: 'https://www.tiktok.com/@gradientacademy'
    }
];

const Footer = (): JSX.Element => {
    const TITLE_BODY_GAP = 4;
    const PRODUCT_BODY_GAP = 3;
    const CONTACT_BODY_GAP = 2;

    return (
        <footer className="w-full flex flex-col bg-[#121212] gap-8 lg:gap-12 px-6 md:px-12 xl:px-24 pt-6 md:pt-8 pb-5 md:pb-6">
            <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-0 w-full">
                <div className="w-full flex flex-col lg:flex-row gap-7 xl:gap-12">
                    {ITEMS.map((item) => (
                        <div
                            key={item.title}
                            className={`flex flex-col gap-${TITLE_BODY_GAP}`}>
                            <Title title={item.title} />
                            <div
                                className={`flex flex-col gap-${PRODUCT_BODY_GAP}`}>
                                {item.bodies.map((body) => (
                                    <Body
                                        key={body.title}
                                        body={body.title}
                                        url={body.url}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col-reverse lg:flex-row gap-7 xl:gap-12 lg:justify-end w-full">
                    <div className={`flex flex-col gap-${TITLE_BODY_GAP}`}>
                        <Title title="Punya Pertanyaan?" />
                        <div
                            className={`flex flex-col gap-${CONTACT_BODY_GAP}`}>
                            <Body
                                body="@gradient_idn"
                                url="https://www.instagram.com/gradient_idn/"
                                Icon={FaInstagram}
                            />
                            <Body
                                body="business@gradient.academy"
                                url="mailto:business@gradient.academy"
                                Icon={MdMailOutline}
                            />
                            <Body
                                body="085179765182"
                                url="https://wa.me/085179765182"
                                Icon={BsWhatsapp}
                            />
                        </div>
                    </div>

                    <div
                        className={`flex flex-col gap-${TITLE_BODY_GAP} lg:max-w-[45%] xl:max-w-[50%]`}>
                        <span className="font-extrabold text-2xl">
                            Gradient
                        </span>
                        <div
                            className={`flex flex-col gap-${CONTACT_BODY_GAP}`}>
                            <h4 className="font-sans font-bold text-sm">
                                Kantor Kami
                            </h4>
                            <div className="flex flex-col gap-1">
                                <span className="font-body text-sm text-[#BBBBBB]">
                                    Gedung Smesco SME Tower Kontrak Hukum Office
                                    Space Lt. 6
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
                <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-4 lg:gap-0">
                    <span className="font-body text-sm text-[#BBBBBB] text-center lg:text-left">
                        © 2023-2024 Gradient Academy. All rights reserved.
                    </span>
                    <div className="flex flex-row gap-4">
                        {SOCIAL_MEDIAS.map(({ Icon, url, className }, idx) => (
                            <SocialMedia
                                key={`social-media-${idx + 1}`}
                                Icon={Icon}
                                url={url}
                                className={className}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

const Title = ({ title }: { title: string }): JSX.Element => {
    return <h4 className="font-sans font-bold">{title}</h4>;
};

const Body = ({
    body,
    url,
    Icon
}: {
    body: string;
    url: string;
    Icon?: IconType;
}): JSX.Element => {
    return (
        <Link
            href={url}
            className="flex items-center gap-2 font-body text-sm text-[#BBBBBB]"
            target={Icon ? '_blank' : '_self'}>
            {Icon && <Icon className="w-[18px] h-[18px] text-[#7264EB]" />}
            {body}
        </Link>
    );
};

const SocialMedia = ({
    Icon,
    url,
    className
}: FooterSocialMediaProps): JSX.Element => {
    return (
        <Link href={url}>
            <Icon className={cn('w-6 h-6', className)} />
        </Link>
    );
};

export default Footer;
