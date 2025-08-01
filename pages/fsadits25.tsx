// import Accordion from 'commons/components/elements/Accordion';
import Accordion from 'commons/components/elements/Accordion';
import Button from 'commons/components/elements/Button';
import Carousel from 'commons/components/elements/Carousel';
import Layout from 'commons/layout';
import { NextSeo } from 'next-seo';
import { toast } from 'react-toastify';

const FSADITS25 = (): JSX.Element => {
    const handleCopy = (): void => {
        navigator.clipboard.writeText(
            `Coba deh temen2 cek disini lagi ada promo Gradient x FSAD ITS https://gradient.academy/fsadits25`
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
            src: 'https://assets.gradient.academy/assets/FSAD+ITS+25+-+1.jpeg',
            alt: 'Gradient x FSAD ITS - Slide 1',
            width: 1080 / 2,
            height: 1350 / 2
        },
        {
            src: 'https://assets.gradient.academy/assets/FSAD+ITS+25+-+2.jpeg',
            alt: 'Gradient x FSAD ITS - Slide 2',
            width: 1080 / 2,
            height: 1350 / 2
        },
        {
            src: 'https://assets.gradient.academy/assets/FSAD+ITS+25+-+3.jpeg',
            alt: 'Gradient x FSAD ITS - Slide 3',
            width: 1080 / 2,
            height: 1350 / 2
        }
    ];

    return (
        <>
            <NextSeo
                title="Gradient x FSAD ITS"
                description="Halo Teman-teman FSAD! Dalam kolaborasi bersama FSAD, kami punya PROMO KHUSUS Massa FSAD ITS untuk menghadapi perkuliahan bersama Gradient✨"
                openGraph={{
                    title: 'Gradient x FSAD ITS',
                    description:
                        'Halo Teman-teman FSAD! Dalam kolaborasi bersama FSAD, kami punya PROMO KHUSUS Massa FSAD ITS untuk menghadapi perkuliahan bersama Gradient✨',
                    url: `https://gradient.academy/fsadits25`,
                    images: [
                        {
                            url: 'https://assets.gradient.academy/assets/FSAD+ITS+25+-+1.jpeg',
                            alt: 'Gradient x FSAD ITS - Slide 1',
                            width: 1080,
                            height: 1350
                        },
                        {
                            url: 'https://assets.gradient.academy/assets/FSAD+ITS+25+-+2.jpeg',
                            alt: 'Gradient x FSAD ITS - Slide 2',
                            width: 1080,
                            height: 1350
                        },
                        {
                            url: 'https://assets.gradient.academy/assets/FSAD+ITS+25+-+3.jpeg',
                            alt: 'Gradient x FSAD ITS - Slide 3',
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
                            Gradient x FSAD ITS
                        </h1>
                        <p className="text-neutral-300">
                            Halo Teman-teman FSAD! Dalam kolaborasi bersama
                            FSAD, kami punya{' '}
                            <b>PROMO KHUSUS Massa FSAD ITS untuk</b>
                            menghadapi perkuliahan bersama Gradient✨
                        </p>
                        <p className="text-neutral-300">
                            Yuk segera daftar! Karna promo ini hanya berlaku
                            sampai tanggal <b>14 Agustus 2025</b>. Jangan sampai
                            ketinggalan~
                        </p>
                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            <Button
                                variant="primary"
                                size="large"
                                className="flex items-center justify-center gap-2 w-full md:w-auto"
                                href="https://forms.gle/Lapv4Dt1nriuTKKX6"
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
                                            'Pihak Panitia akan memberikan kamu voucher yang di dalamnya terdapat kode unik yang dapat dimasukkan ke website/aplikasi Gradient untuk mengaktifkan langganan.'
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

export default FSADITS25;
