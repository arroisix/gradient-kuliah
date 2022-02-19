import { BsPatchCheck } from 'react-icons/bs';
import {
    MdPlayCircleOutline,
    MdOutlineArticle,
    MdOutlineGroup
} from 'react-icons/md';

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
        <div className="flex items-center my-4">
            <div className="text-2xl mr-2">{icons}</div>
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <span className="text-neutral-400 font-thin text-xs">
                    {subtitle}
                </span>
            </div>
        </div>
    );
};

const Benefit = (): JSX.Element => {
    return (
        <div className="px-[7.5rem] mb-16 flex w-full">
            <div className="w-1/2 flex justify-center">
                <div className="rounded-full w-[365px] h-[365px] bg-neutral-900"></div>
            </div>
            <div className="w-1/2">
                <h1 className="text-[2.25rem] font-bold w-3/4">
                    Yang kamu dapet kalo gabung kelas ini
                </h1>
                <div className="mt-12">
                    <BenefitItems
                        icons={<BsPatchCheck />}
                        title="Sertifikat"
                        subtitle="Kamu mendapatkan sertifikat setelah menyelesaikan kelas"
                    />
                    <BenefitItems
                        icons={<MdPlayCircleOutline />}
                        title="Video berkualitas tinggi"
                        subtitle="Video dengan penjelasan yang mudah dipahami dan ramah kuota internet."
                    />
                    <BenefitItems
                        icons={<MdOutlineArticle />}
                        title="Artikel dan latihan soal lengkap"
                        subtitle="Artikel buat referensi nugas, latihan soal buat persiapan ujian."
                    />
                    <BenefitItems
                        icons={<MdOutlineGroup />}
                        title="Komunitas belajar"
                        subtitle="Gabung bareng orang - orang yang bisa motivasi kamu belajar dan nugas."
                    />
                </div>
            </div>
        </div>
    );
};

export default Benefit;
