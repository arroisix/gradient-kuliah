import Layout from 'commons/layout';
import React from 'react';
import Link from 'next/link';
import { BsWhatsapp } from 'react-icons/bs';
import { IconType } from 'react-icons/lib';
import { FaInstagram } from 'react-icons/fa';
import { MdMailOutline } from 'react-icons/md';
import { AiOutlineEnvironment } from 'react-icons/ai';
import { CDN_URL } from '../../commons/constants';
import Image from 'next/image';
import Breadcrumb from '../../commons/components/modules/Breadcrumb';
import useWindowBreakpoints from '../../commons/hooks/useWindowBreakpoints';

const ContactUs = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();

    return (
        <Layout isFullBlackBackground>
            <div className="flex flex-col items-center justify-center min-h-screen py-16">
                <div className="flex flex-col gap-8 w-full max-w-[960px] px-4 md:px-0 pt-8">
                    <Breadcrumb />
                    <div className="relative w-full h-[160px] md:h-[200px] rounded-[16px] border border-[#333333] overflow-hidden">
                        <Image
                            src={
                                isMobileBreakpoints
                                    ? `${CDN_URL}/assets/mobile_contact.png`
                                    : `${CDN_URL}/assets/desktop_contact.png`
                            }
                            priority
                            alt="Gradient Banner"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="flex flex-col bg-[#121212] md:py-8 py-5 md:px-6 px-4 gap-4 w-full h-fit rounded-[16px]">
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            <ContactItem
                                title="WhatsApp"
                                description="085179765182"
                                url="https://api.whatsapp.com/send/?phone=%2B6285179893859&text&type=phone_number&app_absent=0"
                                Icon={BsWhatsapp}
                            />
                            <ContactItem
                                title="Instagram"
                                description="@gradient_idn"
                                url="https://www.instagram.com/gradient_idn/"
                                Icon={FaInstagram}
                            />
                            <ContactItem
                                title="Email"
                                description="business@gradient.academy"
                                url="https://mail.google.com/mail/u/0/?fs=1&to=business@gradient.academy&tf=cm"
                                Icon={MdMailOutline}
                            />
                        </div>
                        <ContactItem
                            title="Alamat"
                            description="Gedung Smesco SME Tower Kontrak Hukum Office Space Lt. 6, Jl. Gatot Subroto Kav. 94, RT.11/RW.3, Kel. Pancoran, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12780"
                            Icon={AiOutlineEnvironment}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

interface ContactItemProps {
    title: string;
    description: string;
    url?: string;
    Icon?: IconType;
}

const ContactItem: React.FC<ContactItemProps> = ({
    title,
    description,
    url,
    Icon
}) => {
    const content = (
        <div className="flex flex-row bg-[#222222] p-4 w-full rounded-[16px] gap-4">
            <div className="bg-[#7264EB] bg-opacity-30 w-fit p-3 h-fit flex items-center justify-center rounded-[50px]">
                {Icon && <Icon className="w-[28px] h-[28px] text-[#B6A6F3]" />}
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-base font-sans font-bold">{title}</h1>
                <p className="text-sm text-[#999999] font-body">
                    {description}
                </p>
            </div>
        </div>
    );

    if (url) {
        return (
            <Link href={url} className="w-full">
                {content}
            </Link>
        );
    }

    return content;
};

export default ContactUs;
