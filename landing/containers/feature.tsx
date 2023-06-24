import Image from 'next/image';
import { ReactNode } from 'react';
import { BiBookReader } from 'react-icons/bi';
import { HiOutlineFilm } from 'react-icons/hi';
import { RiBookOpenLine, RiQuestionnaireLine } from 'react-icons/ri';
import { TfiMenuAlt } from 'react-icons/tfi';
import { VscHubot } from 'react-icons/vsc';

const LIST_FEATURE = [
    {
        title: 'Video',
        description: 'Kalkulus & Probstat: 330+ video belajar on-demand.',
        imageUrl: 'https://assets.gradient.academy/assets/feature-video.png',
        icon: (
            <HiOutlineFilm className="w-full h-full p-[5px] md:p-[10px] object-contain" />
        )
    },
    {
        title: 'Latihan',
        description: 'Latihan dan pembahasan dari textbook & ujian tahun lalu.',
        imageUrl: 'https://assets.gradient.academy/assets/feature-latihan.png',
        icon: (
            <BiBookReader className="w-full h-full p-[5px] md:p-[10px] object-contain" />
        )
    },
    {
        title: 'Rangkuman',
        description:
            'Rangkuman digital dengan ilustrasi & teks yang mudah dibaca.',
        imageUrl:
            'https://assets.gradient.academy/assets/feature-rangkuman.png',
        icon: (
            <TfiMenuAlt className="w-full md:w-[44px] h-full p-[5px] md:p-[12px] object-contain" />
        )
    },
    {
        title: 'Komunitas',
        description: 'Tanya, jawab, & diskusi dengan member lain.',
        imageUrl:
            'https://assets.gradient.academy/assets/feature-komunitas.png',
        icon: (
            <RiQuestionnaireLine className="w-full h-full p-[5px] md:p-[10px] object-contain" />
        )
    },
    {
        title: 'Copilot',
        description:
            'Asisten belajar AI yang jawab apapun pertanyaanmu kapan saja.',
        imageUrl: 'https://assets.gradient.academy/assets/feature-copilot.png',
        icon: (
            <VscHubot className="w-full h-full p-[5px] md:p-[10px] object-contain" />
        )
    },
    {
        title: 'Studio',
        description: 'Akses buku gratis atau upload materimu & chat dengannya.',
        imageUrl: 'https://assets.gradient.academy/assets/feature-studio.png',
        icon: (
            <RiBookOpenLine className="w-full h-full p-[5px] md:p-[10px]  object-contain" />
        )
    }
];

const Feature = (): JSX.Element => {
    return (
        <section className="relative overflow-hidden min-h-screen">
            <Hiasan>
                <div className="text-center pt-[53px] md:pt-[101px] px-[18px]">
                    <h2 className="font-extrabold text-xl md:text-4xl">
                        Fitur-fitur di Gradient
                    </h2>
                    <span className="inline-block pt-[10px] md:pt-[18px] text-[#999999] md:text-2xl sm:whitespace-pre-line">
                        {
                            'Temukan banyak fitur unik dan canggih dalam Gradient \n yang bisa membantumu belajar secara efektif.'
                        }
                    </span>
                </div>
            </Hiasan>
            <div className="w-[80%] mx-auto">
                {LIST_FEATURE.map(
                    ({ title, description, imageUrl, icon }, index) => (
                        <Card
                            key={index}
                            title={title}
                            description={description}
                            imageUrl={imageUrl}
                            icon={icon}
                            isEven={index % 2 === 0}
                            isFirst={index === 0}
                        />
                    )
                )}
            </div>
            <Hiasan className="rotate-180" />
        </section>
    );
};

const Hiasan = ({
    className,
    children
}: {
    className?: string;
    children?: ReactNode;
}): JSX.Element => {
    return (
        <div
            className={`relative overflow-hidden w-full h-[240px] md:h-[430px] ${className}`}>
            <div className="absolute bottom-0 overflow-hidden w-full h-[140px] md:h-[330px]">
                <div className="w-[2200px] h-[2200px] absolute top-0 left-[50%] translate-x-[-50%] bg-gradient-to-b from-[#7876C566] via-black via-10% to-black to-10% rounded-full"></div>
                <div className="w-[2199px] h-[2199px] absolute top-0 left-[50%] translate-x-[-50%] translate-y-[1px] bg-black rounded-full"></div>
                <div className="w-full h-full absolute">{children}</div>
            </div>
            <div className="w-full h-full bg-gradient-purple-thin"></div>
        </div>
    );
};

const Card = ({
    title,
    description,
    imageUrl,
    icon,
    isEven,
    isFirst
}: {
    title: string;
    description: string;
    imageUrl: string;
    icon: ReactNode;
    isEven: boolean;
    isFirst: boolean;
}): JSX.Element => {
    return (
        <div
            className={`w-full h-[444px] flex flex-col-reverse justify-center items-center gap-[26px] md:gap-0 ${
                isEven ? 'md:flex-row-reverse' : 'md:flex-row'
            } ${isFirst ? '' : 'border-t-[1px] border-[#FFFFFF1A]'}`}>
            <div className="w-full md:w-1/2 relative">
                <div className="relative w-full h-[190px] md:h-[210px] mx-auto z-[1]">
                    <Image
                        src={imageUrl}
                        loading="lazy"
                        sizes="none"
                        layout="fill"
                        className="object-contain"
                    />
                </div>
                <div className="w-[300px] h-[300px] md:w-[350px] md:h-[350px] bg-gradient-purple-thin absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"></div>
            </div>
            <div className="w-full md:w-1/2">
                <div
                    className={`lg:w-[400px] mx-auto text-center md:text-left ${
                        isEven ? 'md:pr-[81px]' : 'md:pl-[81px]'
                    }`}>
                    <div className="flex justify-center md:justify-start items-center gap-[6px] md:gap-[18px]">
                        <div className="bg-[#323232] w-[24px] h-[24px] md:w-[44px] md:h-[44px] rounded-full flex justify-center items-center">
                            {icon}
                        </div>
                        <h4 className="font-extrabold md:text-3xl">{title}</h4>
                    </div>
                    <span className="inline-block text-xs md:text-lg pt-[12px] md:pt-[16px] sm:whitespace-pre-line">
                        {description}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Feature;
