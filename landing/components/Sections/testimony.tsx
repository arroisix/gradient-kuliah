import { cn } from 'commons/utils';
import Image from 'next/image';

const TESTIMONY_DATA = [
    {
        testimony:
            'Untuk materi di Gradient saya apresiasi karena berorientasi ke konsep yang disertai visualisasi yang membantu.Untuk itu, saya ingin berterima kasih kepada Gradient karena telah membuka akses materi-materi yang biasanya diajarkan di perguruan tinggi kepada masyarakat luas, semoga kedepannya tetap semangat untuk mencerdaskan bangsa 🙏',
        name: 'Dietrich',
        role: 'SMKN 58 Jakarta',
        photo: 'https://assets.gradient.academy/assets/testimony-Dietrich.jpg'
    },
    {
        testimony:
            'Thank you banget udah ciptain Gradient.Bener-bener ngebantu aku buat paham konsep kalkulus dimana kalo kuliah itu dijelasinnya cuma setengah-setengah doang. Tapi di Gradient ini bener-bener full jelasinnya. Overall gradient keren banget.',
        name: 'Melya',
        role: 'UPN Veteran Jawa Timur',
        photo: 'https://assets.gradient.academy/assets/testimony-Melya.jpg'
    },
    {
        testimony:
            'Pengalaman saya make Gradient sangat bagus ya. Cakupan materinya luas dan dalam, penyampaiannya juga menarik. Susah menemukan penjelasan dan penyampaian materi kalkulus yg bagus di luaran, bahkan di kampus sekalipun. Semoga Gradient bisa mencakup lebih banyak user lagi dan materinya juga lebih beragam.',
        name: 'Muhammad Fauzan Insanda',
        role: 'Universitas Lambung Mangkurat',
        photo: 'https://assets.gradient.academy/assets/testimony-Fauzan.jpeg'
    },
    {
        testimony:
            'Materi yang diajarkan di Gradient sangat relevan dan mudah dimengerti. Pengajar-pengajarnya memiliki skill yang sesuai dan berkelas! Pengalaman menggunakan Gradient juga sangat unik dan eksklusif. Pokoknya nyaman banget dan emang se-worth it itu!',
        name: 'Irfan Musthofa',
        role: 'Institut Teknologi Bandung',
        photo: 'https://assets.gradient.academy/assets/testimony-Irfan.png'
    }
];

const TestimonyCard = ({
    testimony,
    name,
    role,
    photo
}: {
    testimony: string;
    name: string;
    role: string;
    photo: string;
}): JSX.Element => {
    return (
        <div className="w-[245px] md:w-[422px] p-6 bg-gradient-to-t from-[#FFFFFF00] to-[#FFFFFF0D] border-[1px] border-[#2D2D2D] rounded-[24px]">
            <div className="flex gap-4 items-center pb-6 border-b-[1px] border-[#2D2D2D]">
                <div className="w-10 h-10 overflow-hidden rounded-full">
                    <Image
                        loading="lazy"
                        src={photo}
                        height={56}
                        width={56}
                        className="object-cover"
                        alt="testimony"
                    />
                </div>
                <div className="flex flex-col md:gap-[6px]">
                    <span className="inline-block text-xs font-extrabold">
                        {name}
                    </span>
                    <span className="inline-block font-body text-[10px] text-neutral-400">
                        {role}
                    </span>
                </div>
            </div>
            <article>
                <p className="pt-6 text-xs font-body md:text-sm">{testimony}</p>
            </article>
        </div>
    );
};

const Testimony = ({ revamped }: { revamped?: boolean }): JSX.Element => {
    return (
        <section className="">
            <h3
                className={cn(
                    'font-extrabold text-center text-xl ',
                    revamped ? 'md:text-3xl' : 'md:text-4xl'
                )}>
                Kata Mereka
            </h3>
            <div className="w-full h-full py-10 overflow-hidden">
                <div className="flex group">
                    <div className="flex gap-5 md:gap-6 px-[10px] md:px-3 animate-slide-left group-hover:animate-pause">
                        {TESTIMONY_DATA.map((data) => (
                            <TestimonyCard
                                testimony={data.testimony}
                                photo={data.photo}
                                name={data.name}
                                role={data.role}
                                key={data.name}
                            />
                        ))}
                    </div>
                    <div className="flex gap-5 md:gap-6 px-[10px] md:px-3 animate-slide-left group-hover:animate-pause">
                        {TESTIMONY_DATA.map((data) => (
                            <TestimonyCard
                                testimony={data.testimony}
                                photo={data.photo}
                                name={data.name}
                                role={data.role}
                                key={data.name}
                            />
                        ))}
                    </div>
                    <div className="flex gap-5 md:gap-6 px-[10px] md:px-3 animate-slide-left group-hover:animate-pause">
                        {TESTIMONY_DATA.map((data) => (
                            <TestimonyCard
                                testimony={data.testimony}
                                photo={data.photo}
                                name={data.name}
                                role={data.role}
                                key={data.name}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimony;
