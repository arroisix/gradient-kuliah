// import Accordion from 'commons/components/elements/Accordion';
import Button from 'commons/components/elements/Button';
import { BsWhatsapp } from 'react-icons/bs';
import Layout from 'commons/layout';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { toast } from 'react-toastify';

const LiveMandiriBatch2 = (): JSX.Element => {
    const handleCopy = (): void => {
        navigator.clipboard.writeText(
            `Yuk join Kelas Live Persiapan Ujian Mandiri Batch 2 dari Gradient! bisa langsung cek di https://gradient.academy/live-mandiri-batch2`
        ),
            toast.success(
                'Link berhasil di-copy, silahkan bagikan ke teman teman kamu!',
                {
                    theme: 'colored'
                }
            );
    };
    return (
        <>
            <NextSeo
                title="Kelas Online Persiapan Ujian Mandiri # Batch 2"
                description="Untuk teman teman yang ingin mempersiapkan untuk
                            mengikuti ujian mandiri, ini kesempatan yang bagus
                            untuk kamu! di kelas ini kita akan belajar dan
                            membahas soal soal ujian mandiri dari ITB, UGM dan
                            juga SIMAK UI."
                openGraph={{
                    title: 'Kelas Online Persiapan Ujian Mandiri # Batch 2',
                    description:
                        'Untuk teman teman yang ingin mempersiapkan untuk mengikuti ujian mandiri, ini kesempatan yang bagus untuk kamu! di kelas ini kita akan belajar dan membahas soal soal ujian mandiri dari ITB, UGM dan juga SIMAK UI.',
                    url: `https://gradient.academy/live-mandiri-batch2`,
                    images: [
                        {
                            url: 'https://assets.gradient.academy/assets/live-mandiri-batch2.png',
                            width: 1350,
                            height: 1080,
                            alt: 'Kelas Live Persiapan Ujian Mandiri Batch 2 Gradient'
                        }
                    ]
                }}
            />
            <Layout>
                <div className="flex flex-col md:flex-row items-center md:item-start md:justify-center gap-4 pt-14 md:pt-16">
                    <div className="md:aspect-[1080/1350] overflow-hidden h-full w-full">
                        <a
                            className="aspect-[1080/1350] relative cursor-pointer"
                            href="https://wa.me/+6285179893859?text=Halo%20Admin%20Gradient,%20saya%20ingin%20daftar%20kelas%20Live%20Mandiri%20Batch%202"
                            target="_blank"
                            rel="noreferrer">
                            <Image
                                src="https://assets.gradient.academy/assets/live-mandiri-batch2.png"
                                layout="responsive"
                                height={1350}
                                width={1080}
                                alt="Kelas Live Persiapan Ujian Mandiri Batch 2 Gradient"
                            />
                        </a>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-4 w-full p-4 md:p-16 md:h-screen overflow-y-auto">
                        <h1 className="md:text-5xl text-xl font-bold">
                            Kelas Online Persiapan Ujian Mandiri # Batch 2
                        </h1>
                        <p className="text-neutral-300">
                            Untuk teman teman yang ingin mempersiapkan untuk
                            mengikuti ujian mandiri, ini kesempatan yang bagus
                            untuk kamu! di kelas ini kita akan belajar dan
                            membahas soal soal ujian mandiri dari ITB, UGM dan
                            juga SIMAK UI.
                        </p>
                        <p className="text-neutral-300">
                            Yuk gas langsung daftar kelas ini, karena kuota nya
                            terbatas, cuma 5 orang pertama aja, jangan sampai
                            ketinggalan!
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="primary"
                                size="large"
                                className="flex items-center justify-center gap-2 w-full md:w-auto"
                                href="https://wa.me/+6285179893859?text=Halo%20Admin%20Gradient,%20saya%20ingin%20daftar%20kelas%20Live%20Mandiri%20Batch%202"
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
                        {/* <div className="h-[2px] w-full bg-neutral-500" />
                        <h2 className="text-lg md:text-3xl font-bold mb-4">
                            Pertanyaan yang sering ditanyakan.
                        </h2>
                        <div className="w-full">
                            <Accordion
                                item={[
                                    {
                                        title: 'Bagaimana cara mendaftar Webinar ini?',
                                        content:
                                            'Kamu cukup klik tombol "Daftar Sekarang" yang ada di halaman ini lalu isi data yang diperlukan untuk registrasi. Kamu diharuskan untuk memiliki akun Gradient terlebih dahulu sebelum bisa mendaftar ke Webinar ini ya!'
                                    },
                                    {
                                        title: 'Apakah Webinar ini Gratis?',
                                        content: 'Ya, Webinar ini 100% GRATIS'
                                    },
                                    {
                                        title: 'Apakah Webinar ini akan diselenggarakan secara Online?',
                                        content:
                                            'Ya, Webinar ini akan 100% full Online via Google Meet. Tim Gradient akan membagikan link Google Meet kepada peserta Webinar pada saat hari H'
                                    }
                                ]}
                            />
                        </div> */}
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default LiveMandiriBatch2;
