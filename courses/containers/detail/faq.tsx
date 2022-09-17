import { FaInstagram } from 'react-icons/fa';
import Accordion from 'commons/components/elements/Accordion';
import Button from 'commons/components/elements/Button';

const FAQ_CALCULUS = [
    {
        title: 'Apakah kurikulum Kalkulus I - Gradient sesuai dengan universitasku?',
        content:
            'Gradient akan memastikan kurikulum Kalkulus I lebih lengkap dibandingkan universitas pada umumnya. Kalau ada topik materi yang belum ada, kamu bisa lapor ke Gradient'
    },
    {
        title: 'Isi tutornya bakal ngapain aja ya?',
        content:
            'Kita bakal review konsep yang belom paham dan kita bakal bahas soal-soal supaya bisa kebayang gimana nerapin teori yang udah dipelajarin. Kamu juga bisa request topik, konsep atau soal apa yang bakal dibahas.'
    },
    {
        title: 'Siapa aja yang bisa ambil kelas ini?',
        content:
            'Siapapun bisa ngambil kelas ini yaa! Dari universitas manapun, lagi gap year atau bahkan yang belom kuliah, kamu bisa banget ngikutin kelas ini karna bakal dapetin materi materi dasar dari matematika seperti bilangan, fungsi, turunan dan integral.'
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
