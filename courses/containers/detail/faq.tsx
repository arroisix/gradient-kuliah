import { FaInstagram } from 'react-icons/fa';
import Accordion from 'commons/components/elements/Accordion';
import Button from 'commons/components/elements/Button';

const FAQ_CALCULUS = [
    {
        title: 'Kelas Kalkulus I untuk siapa?',
        content:
            'Kalkulus I adalah kelas yang wajib diambil oleh yang mengambil jurusan Teknik, MIPA, Keuangan, dan lainnya. Tapi buat kamu yang penasaran tentang ilmu matematika yang mencoba untuk “mengkuantifikasi perubahan” juga bisa ambil kelas ini ya!'
    },
    {
        title: 'Aku masih SMA, bisa ambil kelas ini ga?',
        content:
            'Bisa! Kelas Kalkulus I sebenarnya mencakup materi yang sudah pernah diajarin di SMA. Yang membedakan cuma cara mengajarnya, yang mana Gradient menekankan pada konsep dan juga cerita di belakang lahirnya Kalkulus!'
    },
    {
        title: 'Apakah kurikulum Kalkulus I - Gradient sesuai dengan universitasku?',
        content:
            'Gradient akan memastikan kurikulum Kalkulus I lebih lengkap dibandingkan universitas pada umumnya. Kalau ada topik materi yang belum ada, kamu bisa lapor ke Discord Gradient dan kami akan melengkapi topik materi tersebut sesegera mungkin.'
    },
    {
        title: 'Ada tutorial dan latihan soal ga?',
        content:
            'Gradient akan memberikan tutorial dan latihan soal. Untuk sementara ini kamu bisa nanya-nanya ke Dedicated Student Tutor di Discord Gradient!'
    }
];

const Faq = (): JSX.Element => {
    return (
        <div className="w-screen py-16 flex-col px-4 md:px-[7.5rem] mb-16">
            <div className="w-full md:text-center">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                    Pertanyaan yang sering ditanyakan.
                </h1>
            </div>
            <div className="w-full">
                <Accordion item={FAQ_CALCULUS} />
            </div>
            <div className="w-full flex flex-col md:flex-row justify-center items-center mt-16">
                <p className="md:mr-4">Ada yang mau kamu tanya?</p>
                <div className="mt-4 md:mt-0">
                    <Button
                        variant="primary"
                        href="https://www.instagram.com/gradient_idn/">
                        <span className="flex items-center">
                            <FaInstagram className="mr-2" /> Hubungi Kami
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Faq;
