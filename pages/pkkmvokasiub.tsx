// import Accordion from 'commons/components/elements/Accordion';
import Accordion from 'commons/components/elements/Accordion';
import Button from 'commons/components/elements/Button';
import Carousel from 'commons/components/elements/Carousel';
import Layout from 'commons/layout';
import { NextSeo } from 'next-seo';
import { toast } from 'react-toastify';

const Scientia25 = (): JSX.Element => {
    const handleCopy = (): void => {
        navigator.clipboard.writeText(
            `Coba deh temen2 cek disini lagi ada promo Gradient x PKKMB Vokasi UB 2025 https://gradient.academy/pkkmbvokasiub`
        ),
            toast.success(
                'Link berhasil di-copy, silahkan bagikan ke teman teman kamu!',
                {
                    theme: 'colored'
                }
            );
    };

    const carouselImages = [
        {
            src: 'https://assets.gradient.academy/assets/pkkmbvokasiub-1.jpeg',
            alt: 'Gradient x PKKMB Vokasi UB 2025 - Slide 1',
            width: 1080 / 2,
            height: 1350 / 2
        },
        {
            src: 'https://assets.gradient.academy/assets/pkkmbvokasiub-2.jpeg',
            alt: 'Gradient x PKKMB Vokasi UB 2025 - Slide 2',
            width: 1080 / 2,
            height: 1350 / 2
        }
    ];

    return (
        <>
            <NextSeo
                title="Gradient x PKKMB Vokasi UB 2025"
                description="Halo Teman-teman Vokasi UB! Dalam kolaborasi bersama PKKMB Vokasi UB 2025, kami punya PROMO KHUSUS untuk Mahasiswa Vokasi UB bisa berlangganan Gradient✨ "
                openGraph={{
                    title: 'Gradient x PKKMB Vokasi UB 2025',
                    description:
                        'Halo Teman-teman Vokasi UB! Dalam kolaborasi bersama PKKMB Vokasi UB 2025, kami punya PROMO KHUSUS untuk Mahasiswa Vokasi UB bisa berlangganan Gradient✨ ',
                    url: `https://gradient.academy/pkkmbvokasiub`,
                    images: [
                        {
                            url: 'https://assets.gradient.academy/assets/pkkmbvokasiub-1.jpeg',
                            alt: 'Gradient x PKKMB Vokasi UB 2025 - Slide 1',
                            width: 1080,
                            height: 1350
                        },
                        {
                            url: 'https://assets.gradient.academy/assets/pkkmbvokasiub-2.jpeg',
                            alt: 'Gradient x PKKMB Vokasi UB 2025 - Slide 2',
                            width: 1080,
                            height: 1350
                        }
                    ]
                }}
            />
            <Layout>
                <div className="flex flex-col md:flex-row items-center md:item-start md:justify-center gap-4">
                    <div className="md:aspect-[1080/1350] overflow-hidden h-full w-full">
                        <Carousel
                            images={carouselImages}
                            target="_blank"
                            rel="noreferrer"
                        />
                    </div>
                    <div className="flex flex-col items-start justify-start gap-4 w-full p-4 md:p-16 md:h-screen overflow-y-auto">
                        <h1 className="md:text-5xl text-xl font-bold">
                            Gradient x PKKMB Vokasi UB 2025
                        </h1>
                        <p className="text-neutral-300">
                            Halo Teman-teman Vokasi UB! Dalam kolaborasi bersama
                            Gradient x PKKMB Vokasi UB 2025, kami punya{' '}
                            <b>PROMO KHUSUS</b> untuk Mahasiswa <b>Vokasi UB</b>{' '}
                            bisa berlangganan Gradient✨
                        </p>
                        <p className="text-neutral-300">
                            Yuk segera daftar! Karna promo ini hanya berlaku
                            sampai tanggal <b>4 Oktober 2025</b>. Jangan sampai
                            ketinggalan~
                        </p>
                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            <Button
                                variant="primary"
                                size="large"
                                className="flex items-center justify-center gap-2 w-full md:w-auto"
                                href="https://forms.gle/C5rCjeyG31mFg6ky7"
                                target="_blank">
                                Klik disini untuk Daftar
                            </Button>
                            <Button
                                size="large"
                                variant="neutral"
                                className="w-full md:w-[100px]"
                                onClick={handleCopy}>
                                Share
                            </Button>
                        </div>
                        <div className="h-[2px] w-full bg-neutral-500" />
                        <h2 className="text-lg md:text-3xl font-bold mb-4">
                            Pertanyaan yang sering ditanyakan.
                        </h2>
                        <div className="w-full">
                            <Accordion
                                item={[
                                    {
                                        title: 'Bagaimana saya dapat mengakses Gradient setelah membeli?',
                                        content:
                                            'Setelah closing PO kami akan memberikan kamu kode aktivasi yang dapat dimasukkan ke website/aplikasi Gradient untuk mengaktifkan langganan.'
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Scientia25;
