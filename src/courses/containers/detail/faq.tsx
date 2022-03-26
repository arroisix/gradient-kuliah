import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import Accordion from 'src/commons/components/elements/Accordion';

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

const Faq = (): JSX.Element => {
    return (
        <div className="w-screen py-16 flex-col px-4 md:px-[7.5rem] mb-16">
            <div className="w-full md:text-center">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                    Pertanyaan yang sering ditanyakan.
                </h1>
            </div>
            <div className="w-full">
                <Accordion item={FAQ_CONTENT} />
            </div>
            <div className="w-full flex flex-col md:flex-row justify-center items-center mt-16">
                <p className="md:mr-4">Ada yang mau kamu tanya?</p>
                <div className="mt-4 md:mt-0">
                    <Link href="https://api.whatsapp.com/send?phone=081310028280">
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
