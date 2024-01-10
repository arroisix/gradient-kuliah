import { MdPlayCircleOutline, MdOutlineGroup, MdNotes } from 'react-icons/md';
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
                <h2 className="md:text-left text-xl md:text-2xl font-bold">
                    {title}
                </h2>
                <p className="md:text-left text-neutral-400 text-base mt-2">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

const BenefitKalkulus1Section = (): JSX.Element => {
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
                        title="120+ Video Pembelajaran On Demand"
                        subtitle="Materi lengkap yang bisa kamu akses kapan aja dan diajar langsung sama dosen terbaik di Indonesia"
                    />
                    <BenefitItems
                        icons={<MdNotes />}
                        title="AstroNotes: Notebook (Catatan) dari Gradient, Lengkap!"
                        subtitle="Catatan dan Rangkuman Materi yang disusun oleh Gradient"
                    />
                    <BenefitItems
                        icons={<MdOutlineGroup />}
                        title="Komunitas Gradient"
                        subtitle="Belajar dan nugas bareng mahasiswa dari seluruh Indonesia"
                    />
                </div>
                <div className="h-full w-[50vw] hidden md:flex">
                    <Image
                        src="https://assets.gradient.academy/courses/calculus/assets/benefit-asset.png"
                        loading="lazy"
                        width={650}
                        height={500}
                    />
                </div>
            </div>
            <div className="w-full flex justify-center items-center mb-8">
                <SubscribeButton slug="kalkulus1" />
            </div>
        </>
    );
};

export default BenefitKalkulus1Section;
