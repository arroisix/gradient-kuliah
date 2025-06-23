import Accordion from 'commons/components/elements/Accordion';
import Button from 'commons/components/elements/Button';
import Carousel from 'commons/components/elements/Carousel';
import { BsWhatsapp } from 'react-icons/bs';
import Layout from 'commons/layout';
import { NextSeo } from 'next-seo';
import { toast } from 'react-toastify';

const LiveClassProgramming = (): JSX.Element => {
    const handleCopy = (): void => {
        navigator.clipboard.writeText(
            `Yuk join Live Class Programming dari Gradient! bisa langsung cek di https://gradient.academy/live-class-programming`
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
            src: 'https://assets.gradient.academy/assets/liva-class-programming-slide-1.webp',
            alt: 'Kelas Live Programming Persiapan untuk CALON MABA - Slide 1',
            width: 1080,
            height: 1350
        },
        {
            src: 'https://assets.gradient.academy/assets/live-class-programming-slide-2.webp',
            alt: 'Kelas Live Programming Persiapan untuk CALON MABA - Slide 2',
            width: 1080,
            height: 1350
        }
    ];

    return (
        <>
            <NextSeo
                title="Live Class Programming Persiapan untuk CALON MABA"
                description="Untuk teman teman calon mahasiswa baru yang ingin mempelajari dasar-dasar pemrograman, ini kesempatan yang bagus untuk kamu! Di kelas ini kita akan belajar dan membahas berbagai konsep dasar pemrograman yang penting untuk kamu gunakan selama masa perkuliahan kamu."
                openGraph={{
                    title: 'Live Class Programming Persiapan untuk CALON MABA',
                    description:
                        'Untuk teman teman calon mahasiswa baru yang ingin mempelajari dasar-dasar pemrograman, ini kesempatan yang bagus untuk kamu! Di kelas ini kita akan belajar dan membahas berbagai konsep dasar pemrograman yang penting untuk kamu gunakan selama masa perkuliahan kamu.',
                    url: `https://gradient.academy/live-class-programming`,
                    images: [
                        {
                            url: 'https://assets.gradient.academy/assets/live-class-programming-slide-1.webp',
                            width: 1350,
                            height: 1080,
                            alt: 'Live Class Programming Persiapan untuk CALON MABA'
                        },
                        {
                            url: 'https://assets.gradient.academy/assets/live-class-programming-slide-2.webp',
                            width: 1350,
                            height: 1080,
                            alt: 'Live Class Programming Persiapan untuk CALON MABA - Slide 2'
                        }
                    ]
                }}
            />
            <Layout>
                <div className="flex flex-col md:flex-row items-center md:item-start md:justify-center gap-4 pt-14 md:pt-16">
                    <div className="md:aspect-[1080/1350] overflow-hidden h-full w-full">
                        <Carousel
                            images={carouselImages}
                            target="_blank"
                            rel="noreferrer"
                        />
                    </div>
                    <div className="flex flex-col items-start justify-start gap-4 w-full p-4 md:p-16 md:h-screen overflow-y-auto">
                        <h1 className="md:text-5xl text-xl font-bold">
                            Live Class Programming Persiapan untuk CALON MABA
                        </h1>
                        <p className="text-neutral-300">
                            Untuk teman teman calon mahasiswa baru yang ingin
                            mempelajari dasar-dasar pemrograman, ini kesempatan
                            yang bagus untuk kamu! Di kelas ini kita akan
                            belajar dan membahas berbagai konsep dasar
                            pemrograman yang penting untuk kamu gunakan selama
                            masa perkuliahan kamu.
                        </p>
                        <p className="text-neutral-300">
                            Yuk gas langsung daftar kelas ini, karena kuota nya
                            terbatas, jangan sampai ketinggalan!
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="primary"
                                size="large"
                                className="flex items-center justify-center gap-2 w-full md:w-auto"
                                href="https://wa.me/+6285179893859?text=Halo%20Admin%20Gradient,%20saya%20ingin%20daftar%20kelas%20Live%20Class%20Programming"
                                target="_blank">
                                <BsWhatsapp className="text-xl" />
                                Hubungi Admin untuk Daftar
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
                                        title: 'Bahasa pemrograman apa yang akan digunakan?',
                                        content: 'Python.'
                                    },
                                    {
                                        title: 'Apakah perlu laptop?',
                                        content:
                                            'Ya, untuk mengikuti LIVE Class Programming, disarankan dengan laptop.'
                                    },
                                    {
                                        title: 'Apakah bisa membeli LIVE Class Programming tanpa Paket 3 Bulan?',
                                        content:
                                            'Mohon maaf, untuk sementara hanya bisa dengan Paket 3 Bulan'
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

export default LiveClassProgramming;
