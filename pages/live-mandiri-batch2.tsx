import Accordion from 'commons/components/elements/Accordion';
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
                description="Untuk teman teman yang ingin mempersiapkan untuk mengikuti ujian mandiri, ini kesempatan yang bagus untuk kamu! di kelas ini kita akan belajar dan membahas soal soal ujian mandiri seperti Utul UGM dan juga SIMAK UI."
                openGraph={{
                    title: 'Kelas Online Persiapan Ujian Mandiri # Batch 2',
                    description:
                        'Untuk teman teman yang ingin mempersiapkan untuk mengikuti ujian mandiri, ini kesempatan yang bagus untuk kamu! di kelas ini kita akan belajar dan membahas soal soal ujian mandiri seperti Utul UGM dan juga SIMAK UI.',
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
                            membahas soal soal ujian mandiri seperti Utul UGM
                            dan juga SIMAK UI.
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
                        <div className="h-[2px] w-full bg-neutral-500" />
                        <h2 className="text-lg md:text-3xl font-bold mb-4">
                            Pertanyaan yang sering ditanyakan.
                        </h2>
                        <div className="w-full">
                            <Accordion
                                item={[
                                    {
                                        title: 'Apa saja yang akan dibahas?',
                                        content:
                                            'Kita akan bahas soal-soal asli SIMAK UI tahun-tahun sebelumnya.'
                                    },
                                    {
                                        title: 'Apakah dapat recordingnya?',
                                        content:
                                            'Ya, kamu akan mendapatkan recording dari semua sesi.'
                                    },
                                    {
                                        title: 'Apakah akan membahas SM ITB?',
                                        content:
                                            '<b>Tidak</b>, live tutor ini diadakan 16-20 Juni, yang mana itu adalah setelah tanggal ujian mandiri di ITB yakni 12 Juni.'
                                    },
                                    {
                                        title: 'Apa saja yang akan saya dapat sebagai member Gradient?',
                                        content:
                                            'Kamu akan mendapat semua video belajar, latihan, bank soal, dan rangkuman yang ada di Gradient. Termasuk, bank soal dan pembahasan soal SM ITB, SIMAK UI, dan UM UGM.'
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

export default LiveMandiriBatch2;
