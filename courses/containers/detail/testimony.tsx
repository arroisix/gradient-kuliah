import { FaQuoteLeft } from 'react-icons/fa';

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
        <div className="w-[320px] border-[#666666] rounded-lg border h-[300px] flex flex-col justify-between p-4">
            <div>
                <FaQuoteLeft className="text-xl text-neutral-500 mb-2" />
                <span className="font-body text-[14px]">{testimony}</span>
            </div>
            <div className="flex w-full items-center">
                <div className="h-14 w-14 bg-neutral-200 rounded-full overflow-hidden flex justify-center items-center">
                    <img
                        src={photo}
                        className="h-full object-cover"
                        alt="lecturer"
                    />
                </div>
                <div className="ml-2">
                    <h5 className="text-xs text-white font-bold">{name}</h5>
                    <h5 className="text-[11px] font-thin text-neutral-400 font-body">
                        {role}
                    </h5>
                </div>
            </div>
        </div>
    );
};

const Testimony = (): JSX.Element => {
    return (
        <div className="pl-4 md:pl-[7.5rem] py-4">
            <h3 className="text-2xl md:text-4xl font-bold">Kata Mereka</h3>
            <div className="w-full py-4 overflow-x-auto">
                <div className="w-[1400px] flex gap-8">
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
    );
};

export default Testimony;
