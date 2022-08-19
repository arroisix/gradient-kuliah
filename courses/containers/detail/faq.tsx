import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import Accordion from 'commons/components/elements/Accordion';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CALCULUS_ID = '25474ea4-5bbf-4e3e-95e3-4cec647d95bf';
// const CALCULUS_ID = '92d9c460-f1cd-4400-ba2b-3477430a11f9';

const FAQ_CONTENT = [
    {
        title: 'Apa itu Gradient?',
        content:
            'Gradient adalah alternatif kuliah online dengan harga terjangkau yang menggabungkan guru-guru terbaik, konten sinematik, pedagogi berdasarkan sains, dan teknologi.'
    },
    {
        title: 'Aku masih SMA, aku memenuhi syarat untuk ikut kelas ini ga?',
        content:
            'Iya! Kelas ini didesain agar teman-teman SMA juga bisa mencoba kelas kuliah dan mendapatkan wawasan tentang jurusan teknik sipil & lingkungan. Tujuannya untuk membantu teman-teman ga salah ambil jurusan kuliah.'
    }
];

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
    },
    {
        title: 'Kenapa free trial?',
        content:
            'Sekarang, materi pada kelas Kalkulus I Gradient belum lengkap. Kami akan melengkapi materinya secara bertahap. Oleh karena itu, kelas Kalkulus I masih gratis untuk kamu yang ingin coba!'
    }
];

const Faq = (): JSX.Element => {
    const router = useRouter();
    const [faq, setFaq] = useState(FAQ_CONTENT);

    const { id } = router.query;

    useEffect(() => {
        if (id && (id as string) === CALCULUS_ID) {
            setFaq(FAQ_CALCULUS);
        }
    }, [id]);

    return (
        <div className="w-screen py-16 flex-col px-4 md:px-[7.5rem] mb-16">
            <div className="w-full md:text-center">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                    Pertanyaan yang sering ditanyakan.
                </h1>
            </div>
            <div className="w-full">
                <Accordion item={faq} />
            </div>
            <div className="w-full flex flex-col md:flex-row justify-center items-center mt-16">
                <p className="md:mr-4">Ada yang mau kamu tanya?</p>
                <div className="mt-4 md:mt-0">
                    <Link href="https://api.whatsapp.com/send?phone=+6281310028280">
                        <div className="flex rounded-full px-4 py-2 bg-[#0F460F]">
                            <span className="text-base font-bold flex items-center">
                                <FaWhatsapp className="mr-2 text-xl" />
                                Hubungi kami
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Faq;
