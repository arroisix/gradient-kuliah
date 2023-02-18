import { MdPlayCircleOutline, MdOutlineGroup, MdEdit } from 'react-icons/md';
import Image from 'next/image';
import SubscribeButton from '../Common/SubscribeButton';

const BenefitItems = ({
    icons,
    title,
    subtitle
}: {
    icons: JSX.Element;
    title: string;
    subtitle: string;
}): JSX.Element => {
    return (
        <div className="flex my-4 gap-2">
            <div className="text-4xl md:text-2xl mt-2">{icons}</div>
            <div>
                <h1 className="md:text-left text-xl md:text-2xl font-bold">
                    {title}
                </h1>
                <p className="md:text-left text-neutral-400 text-base mt-2">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

const BenefitKalkulus2Section = (): JSX.Element => {
    return (
        <>
            <div
                className="pr-4 pl-4 md:pr-0 md:pl-[7.5rem] flex md:flex-row w-full mt-8 md:mt-16 items-center"
                id="benefit">
                <div className="w-screen md:w-[50vw] h-full mt-8 flex flex-col gap-2">
                    <h3 className="text-2xl md:text-4xl font-bold w-full md:w-3/4">
                        Apa yang bakal kamu dapet kalo gabung kelas ini?
                    </h3>
                    <BenefitItems
                        icons={<MdPlayCircleOutline />}
                        title="Video Pembelajaran On Demand"
                        subtitle="Materi lengkap yang bisa kamu akses kapan aja dan diajar langsung sama dosen terbaik di Indonesia"
                    />
                    <BenefitItems
                        icons={<MdEdit />}
                        title="Latihan Soal + Pembahasan"
                        subtitle="Belajar sambil ngerjain latihan soal per topik dan ada pembahasannya!"
                    />
                    <BenefitItems
                        icons={<MdOutlineGroup />}
                        title="Group Exclusive Member"
                        subtitle="Belajar dan diskusi bareng member Gradient"
                    />
                </div>
                <div className="h-full w-[50vw] hidden md:flex">
                    <Image
                        src="https://storage.googleapis.com/gradient-asset-dev/courses/calculus2/assets/benefit-kalkulus2.png"
                        loading="lazy"
                        width={650}
                        height={500}
                    />
                </div>
            </div>
            <div className="w-full flex justify-center items-center mb-8">
                <SubscribeButton slug="kalkulus2" />
            </div>
        </>
    );
};

export default BenefitKalkulus2Section;
