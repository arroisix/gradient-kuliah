import Image from 'next/image';

const TESTIMONY_DATA = [
    {
        testimony:
            'Pertama kali ikut tutor bahas soal dan bener-bener bikin aku paham sama soal matematika yang pusing. Udah gitu kita bisa request materi apa yang mau dibahas dan juga insight baru tentang matematika pokoknya lovee banget',
        name: 'Zahra Ameldinata',
        role: 'Institut Teknologi Bandung',
        photo: 'https://cdn.discordapp.com/attachments/1009679303186862140/1020333856861212712/35FB82BD-3B5D-4981-B22B-A0FE6067EA9B.jpg'
    },
    {
        testimony:
            'Gradient  membuatku lebih paham lagi tentang kalkulus. Ditambah dengan tutornya yang friendly dan kece, aku mendapatkan jawaban-jawaban dari pertanyaanku',
        name: 'Viona Siagian',
        role: 'Institut Teknologi Bandung',
        photo: 'https://cdn.discordapp.com/attachments/1009679303186862140/1020333857318387722/310301.jpg'
    },
    {
        testimony:
            'Video materinya memberikan feel berbeda karena penyampaiannya yang profesional namun mudah untuk dimengerti. Tutorialnya juga sangat menarik karena cara penyampaian materi oleh tutor berbeda dengan tutor yang pernah saya temui sebelumnya',
        name: 'Khairul Amtsal',
        role: 'Universitas Mataram',
        photo: 'https://cdn.discordapp.com/attachments/1009679303186862140/1020333856378863686/DSC_54562.jpg'
    },
    {
        testimony:
            'Cara ngajarnya kakak-kakak tutor di Gradient enak dan seru! Materi yang disampaikan selaras dengan materi di perkuliahan. Keren dan asik deh jadi paham',
        name: 'I Putu Bagus Tegar Suputra J.',
        role: 'Universitas Brawijaya',
        photo: 'https://cdn.discordapp.com/attachments/1009679303186862140/1020333855716155412/841C750D-E040-4AB4-A047-7E2442CFAC37.jpg'
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
                <div className="h-10 w-10 rounded-full overflow-hidden">
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
                    <span className="inline-block font-extrabold text-xs">
                        {name}
                    </span>
                    <span className="inline-block font-body text-[10px] text-neutral-400">
                        {role}
                    </span>
                </div>
            </div>
            <article>
                <p className="pt-6 font-body text-xs md:text-sm">{testimony}</p>
            </article>
        </div>
    );
};

const Testimony = (): JSX.Element => {
    return (
        <section className="">
            <h3 className="font-extrabold text-center text-xl md:text-4xl">
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
