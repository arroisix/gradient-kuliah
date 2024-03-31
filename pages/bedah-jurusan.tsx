import Accordion from 'commons/components/elements/Accordion';
import Button from 'commons/components/elements/Button';
import Layout from 'commons/layout';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { toast } from 'react-toastify';

const Webinar = (): JSX.Element => {
    const handleCopy = (): void => {
        navigator.clipboard.writeText(
            `Yuk join webinar bedah kampus dari Gradient, GRATIS!, bisa langsung cek di https://gradient.academy/bedah-jurusan`
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
                title="Webinar Gradient: Bedah Jurusan #EP01"
                description="Bagi kamu yang masih bingung dalam memilih jurusan,
                            jangan ragu untuk join webinar perdana dari Gradient
                            GRATIS!. dalam
                            episode pertama kali ini, kita akan bersama membahas
                            seluk beluk dari 4 jurusan berbeda bersama pembicara
                            dari beberapa universitas ternama di Indonesia."
                openGraph={{
                    title: 'Webinar Gradient: Bedah Jurusan #EP01',
                    description:
                        'Bagi kamu yang masih bingung dalam memilih jurusan,jangan ragu untuk join webinar perdana dari GradientGRATIS!. dalam episode pertama kali ini, kita akan bersama membahas seluk beluk dari 4 jurusan berbeda bersama pembicara dari beberapa universitas ternama di Indonesia.',
                    url: `https://gradient.academy/bedah-kampus`,
                    images: [
                        {
                            url: 'https://assets.gradient.academy/assets/banner-bedah-jurusan.jpg',
                            width: 300,
                            height: 500,
                            alt: 'Gradient Bedah Jurusan'
                        }
                    ]
                }}
            />
            <Layout>
                <div className="flex flex-col md:flex-row items-center md:item-start md:justify-center gap-4 pt-14 md:pt-16">
                    <div className="md:aspect-[1080/1350] overflow-hidden h-full w-full">
                        <div className="aspect-[1080/1350] relative">
                            <Image
                                src="https://assets.gradient.academy/assets/banner-bedah-jurusan.jpg"
                                layout="responsive"
                                height={1350}
                                width={1080}
                                alt="Bedah Jurusan"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-4 w-full p-4 md:p-16 md:h-screen overflow-y-auto">
                        <h1 className="md:text-5xl text-xl font-bold">
                            Webinar Gradient: Bedah Jurusan #EP01
                        </h1>
                        <p className="text-neutral-300">
                            Bagi kamu yang masih bingung dalam memilih jurusan,
                            jangan ragu untuk join webinar perdana dari Gradient{' '}
                            <span className="font-bold">GRATIS!</span>. dalam
                            episode pertama kali ini, kita akan bersama membahas
                            seluk beluk dari 4 jurusan berbeda bersama pembicara
                            dari beberapa universitas ternama di Indonesia.
                        </p>
                        <p className="text-neutral-300">
                            Siapkan pertanyaan terbaikmu supaya kamu semakin
                            yakin dengan pilihan kamu!
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="primary" href="">
                                Daftar Sekarang
                            </Button>
                            <Button variant="neutral" onClick={handleCopy}>
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
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Webinar;
