import { useAuth } from 'authentication/contexts/AuthProvider';
import Accordion from 'commons/components/elements/Accordion';
import Button from 'commons/components/elements/Button';
import Modal from 'commons/components/modules/Modal';
import { CDN_URL } from 'commons/constants';
import Layout from 'commons/utbkLayout';
import { cn } from 'commons/utils';
import Testimony from 'landing/components/Sections/Testimony';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGetPacketOfferUTBKQuery } from 'payment/redux/api/subscriptionApi';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { FaRegCircleCheck } from 'react-icons/fa6';
import styles from 'styles/utbk.module.css';

function Hero(): JSX.Element {
    return (
        <section className="max-h-[832px] min-h-[775px] w-full aspect-[20/13] relative flex justify-center">
            <picture className="absolute pointer-events-none">
                <source
                    srcSet={`${CDN_URL}/assets/utbk/hero.avif`}
                    type="image/avif"
                    media="(min-width: 861px)"
                    className="max-h-[832px] min-h-[775px] object-cover"
                />
                <source
                    srcSet={`${CDN_URL}/assets/utbk/hero-tablet2.avif`}
                    type="image/avif"
                    media="(min-width: 376px)"
                    className="max-h-[832px] min-h-[775px] object-cover"
                />
                <source
                    srcSet={`${CDN_URL}/assets/utbk/hero-mobile.avif`}
                    type="image/avif"
                    className="max-h-[832px] min-h-[775px] object-cover"
                />
                <img
                    src={`${CDN_URL}/assets/utbk/hero.avif`}
                    alt=""
                    className="max-h-[832px] min-h-[775px] object-cover"
                />
            </picture>

            <div className="flex flex-col items-center z-10 mt-[110px] w-full">
                <p
                    className="text-[11px] leading-[16.5px] uppercase tracking-widest text-[#E9D5FF] border-solid border-[1px] border-opacity-30 border-[#A855F74D] rounded-md px-4 py-[6px] mb-8 text-center"
                    style={{
                        boxShadow: '0px 0px 20px rgba(124, 58, 237, 0.2)',
                        backdropFilter: 'blur(6px)'
                    }}>
                    Platform Belajar No. 1 Untuk UTBK
                </p>
                <h1 className="text-[32px] -tracking-[2.4px] text-white font-extrabold max-w-[238px] md:max-w-[703px] text-center mb-4 md:text-[96px] md:leading-[96px]">
                    Masuk Kampus{' '}
                    <span
                        className={cn(
                            'relative inline-flex justify-center',
                            styles['hero-decor']
                        )}>
                        Impian
                    </span>
                    <br /> Mulai dari Sini.
                </h1>
                <p className="text-center text-[#DEDEDE] text-base md:text-xl leading-[140%] font-semibold max-w-[327px] md:max-w-[664px] mb-10">
                    Sistem persiapan UTBK cerdas yang menghubungkan materi
                    adaptif, analisis AI, dan tryout berbasis IRT dalam satu
                    ekosistem belajar.
                </p>
                <div className="flex flex-col md:flex-row gap-4 self-center mb-16 px-[54px] max-w-[564px] w-full">
                    <Button
                        variant="primary"
                        linkClass="h-[52px] w-full"
                        className="h-[52px] flex items-center justify-center"
                        href="/daftar">
                        Coba Gratis
                    </Button>
                    <Button variant="secondary" className="h-[52px] w-full">
                        Apa itu UTBK?
                    </Button>
                </div>

                <div className="flex flex-col items-center md:flex-row gap-6">
                    <ul className="flex [&>li:not(:first-child)]:-ml-3 *:rounded-full *:h-[50px] *:w-[50px] *:flex list-none p-0">
                        <li>
                            <Image
                                src={`${CDN_URL}/assets/testimonials/achmad-adil.jpg`}
                                data-avatar
                                className="w-full object-cover rounded-full !border-solid !border-2 !border-black"
                                height={50}
                                width={50}
                                loading="lazy"
                            />
                        </li>
                        <li>
                            <Image
                                src={`${CDN_URL}/assets/testimonials/achmad-eugene-its.jpg`}
                                data-avatar
                                className="w-full object-cover rounded-full !border-solid !border-2 !border-black"
                                height={50}
                                width={50}
                                loading="lazy"
                            />
                        </li>
                        <li>
                            <Image
                                src={`${CDN_URL}/assets/testimonials/novia-unbraw.jpg`}
                                data-avatar
                                className="w-full object-cover rounded-full !border-solid !border-2 !border-black"
                                height={50}
                                width={50}
                                loading="lazy"
                            />
                        </li>
                        <li className="bg-[#1F2937] flex items-center justify-center border-solid border-2 border-black">
                            <p className="text-[#9CA3AF] font-bold">+2k</p>
                        </li>
                    </ul>

                    <div className="flex flex-col items-center md:items-start">
                        <img
                            src={`${CDN_URL}/assets/utbk/stars.svg`}
                            height={24}
                            alt=""
                            aria-hidden
                            className="mb-2"
                        />

                        <p className="text-sm leading-4 text-graphite-400">
                            Dipercaya <b>200k+ pelajar</b> Indonesia
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function IRTModal({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
    return (
        <Modal
            isOpen={open}
            setOpen={setOpen}
            variant="dark"
            containerClassName="modal modal-open modal-middle min-h-[100px]">
            <div className="-mt-6 gap-4 flex flex-col text-white">
                <h3 className="text-xl leading-[140%] font-semibold">
                    Apa itu IRT?
                </h3>
                <div className="text-sm leading-[160%] flex flex-col gap-6">
                    <p>
                        IRT adalah sistem penilaian UTBK yang{' '}
                        <b>tidak menyamakan semua soal.</b> Nilai kamu
                        ditentukan bukan cuma dari jumlah benar, tapi juga{' '}
                        <b>tingkat kesulitan soal yang kamu jawab.</b>
                    </p>
                    <p className="p-4 bg-violet-3 rounded-2xl flex flex-col gap-4 font-semibold">
                        🏫 Sistem Ujian Sekolah
                        <ul className="pl-5 text-[#DEDEDE] font-normal">
                            <li>Semua soal bernilai sama.</li>
                            <li>
                                Jawaban benar dihitung satu per satu, tanpa
                                melihat soal itu mudah atau sulit.
                            </li>
                        </ul>
                    </p>
                    <p className="p-4 bg-[#5F2BCE] bg-opacity-20 rounded-2xl flex flex-col gap-4 font-semibold border-solid border-[1px] border-accent-purple">
                        🎓 Sistem UTBK (IRT)
                        <ul className="pl-5">
                            <li>Setiap soal punya bobot berbeda.</li>
                            <li>
                                Menjawab soal yang lebih sulit memberi dampak
                                skor lebih besar dibanding soal yang mudah.
                            </li>
                        </ul>
                    </p>
                    <p>
                        Artinya, jika kamu bisa menjawab soal yang banyak
                        peserta lain gagal, skormu bisa naik lebih signifikan.
                    </p>
                    <p>
                        Gradient menggunakan sistem ini supaya kamu melihat{' '}
                        <b>
                            perkiraan skor yang lebih mendekati hasil UTBK
                            sebenarnya, bukan sekadar jumlah jawaban benar.
                        </b>
                    </p>
                    <Button
                        href="/utbk/try-out"
                        variant="primary"
                        className="flex items-center justify-center text-sm leading-[125%] gap-[6px]"
                        linkClass="w-max self-center">
                        Cek Try Out UTBK Gradient <FaChevronRight size={12} />
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

function Fitur({ className }: { className?: string }): JSX.Element {
    const [showIRTModal, setShowIRTModal] = useState(false);

    return (
        <section className={cn('flex flex-col', className)}>
            <h2 className="flex flex-col items-center text-center gap-3 text-white text-2xl leading-[125%] font-bold mb-3">
                <span className="text-[11px] leading-[13px] text-bold uppercase text-black bg-[#B6A6F3] tracking-widest px-[15px] py-[5px] border-solid border-[#A855F7] border-opacity-30 border-[1px] rounded-full">
                    Fitur Lengkap
                </span>
                Semua yang kamu butuhkan untuk lulus UTBK
            </h2>
            <p className="text-[#9CA3AF] text-sm leading-[20px] text-center mb-16">
                Platform all-in-one dengan fitur canggih untuk memastikan kamu
                siap tempur di hari H.
            </p>

            <ul className="list-none gap-6 max-w-[1200px] self-center p-0 grid grid-cols-1 lg:grid-cols-2">
                <li>
                    <article
                        className="flex flex-col gap-4 text-center bg-[#181818] rounded-[32px] border-solid border-[1px] border-white border-opacity-5 px-4 pt-8 max-w-[720px] hover:border-[#B6A6F3] hover:shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] items-center h-full transition"
                        style={{
                            backgroundImage: `url(${CDN_URL}/assets/utbk/materi-decor.svg)`,
                            backgroundPosition: 'top right',
                            backgroundRepeat: 'no-repeat'
                        }}>
                        <h3 className="flex flex-col gap-4 text-white font-bold text-2xl md:text-3xl leading-[125%] max-w-[634px]">
                            <span className="uppercase flex gap-2 items-center justify-center font-bold text-[#B6A6F3] text-sm tracking-[0.7px]">
                                <img
                                    src={`${CDN_URL}/assets/utbk/materi-icon.svg`}
                                    alt="Video icon"
                                    width={30}
                                />
                                Video Learning
                            </span>
                            Video Materi dari Kakak Mahasiswa Universitas Top
                        </h3>

                        <p className="text-white text-lg leading-[29.25px]">
                            Akses ratusan jam konten video yang dibawakan
                            langsung oleh mahasiswa dari UI, ITB, dan lainnya.
                            Penjelasan santai, mudah dimengerti, dan
                            to-the-point.
                        </p>

                        <Link
                            href="/utbk/materi"
                            className="mb-2 text-[#B6A6F3] font-semibold text-sm leading-[125%] flex gap-1 items-center h-[34px]">
                            Lihat Materi
                            <FaChevronRight height={16} width={16} />
                        </Link>
                        <div className="flex-grow flex items-end">
                            <img
                                src={`${CDN_URL}/assets/utbk/video.avif`}
                                alt="Video learning."
                                height={220}
                                className="h-[220px] sm:h-[450px] lg:h-[344px] object-contain object-bottom"
                            />
                        </div>
                    </article>
                </li>
                <li>
                    <article
                        className="flex items-center flex-col gap-4 text-center bg-[#181818] rounded-[32px] border-solid border-[1px] border-white border-opacity-5 px-4 pt-8 max-w-[720px] hover:border-[#B6A6F3] hover:shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] h-full transition"
                        style={{
                            backgroundImage: `url(${CDN_URL}/assets/utbk/try-out-decor.svg)`,
                            backgroundPosition: 'bottom center',
                            backgroundRepeat: 'no-repeat'
                        }}>
                        <h3 className="flex flex-col gap-4 text-white font-bold text-2xl md:text-3xl leading-[125%]">
                            <span className="uppercase flex gap-2 items-center justify-center font-bold text-[#B6A6F3] text-sm tracking-[0.7px] h-9">
                                <img
                                    src={`${CDN_URL}/assets/utbk/try-out-icon.svg`}
                                    alt="Try out icon"
                                    width={24}
                                />
                                Try Out
                            </span>
                            Tryout Asli UTBK (IRT)
                        </h3>
                        <p className="text-white text-lg leading-[29.25px]">
                            Simulasi ujian dengan format yang sama persis dengan
                            UTBK asli. Menggunakan sistem penilaian Item
                            Response Theory untuk akurasi skor tinggi.
                        </p>
                        <button
                            className="mb-2 text-[#B6A6F3] font-semibold text-sm leading-[125%] h-[34px] flex items-center gap-1"
                            type="button"
                            onClick={() => setShowIRTModal(true)}>
                            Apa itu IRT
                            <FaChevronRight height={16} width={16} />
                        </button>
                        <div className="flex-grow flex items-end">
                            <img
                                src={`${CDN_URL}/assets/utbk/try-out.avif`}
                                alt="Try out."
                                height={220}
                                className="h-[220px] sm:h-[455px] lg:h-[380px] object-contain object-bottom"
                            />
                        </div>
                    </article>
                </li>
                <li>
                    <article
                        className="flex flex-col items-center gap-4 text-center bg-[#181818] rounded-[32px] border-solid border-[1px] border-white border-opacity-5 px-4 pt-8 max-w-[720px] hover:border-[#B6A6F3] hover:shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] h-full transition"
                        style={{
                            backgroundImage: `url(${CDN_URL}/assets/utbk/copilot-decor.svg)`,
                            backgroundPosition: 'bottom right',
                            backgroundRepeat: 'no-repeat'
                        }}>
                        <h3 className="flex flex-col gap-4 text-white font-bold text-2xl md:text-3xl leading-[125%]">
                            <span className="uppercase flex gap-2 items-center justify-center font-bold text-[#B6A6F3] text-sm tracking-[0.7px] h-9">
                                <img
                                    src={`${CDN_URL}/assets/utbk/copilot-icon.svg`}
                                    alt="Copilot icon"
                                    width={32}
                                />
                                Assistant
                            </span>
                            Copilot AI Assistant
                        </h3>
                        <p className="text-white text-lg leading-[29.25px] mb-6">
                            Asisten belajar pribadi berbasis AI yang siap
                            membantumu. Tanyakan soal sulit atau minta
                            penjelasan materi yang belum kamu pahami.
                        </p>
                        <img
                            src={`${CDN_URL}/assets/utbk/copilot3.avif`}
                            alt="Copilot."
                            height={328}
                            className="h-[328px] sm:h-[459px] lg:h-[414px] object-contain object-bottom"
                        />
                    </article>
                </li>
                <li>
                    <article
                        className="flex flex-col items-center gap-4 text-center bg-[#181818] rounded-[32px] border-solid border-[1px] border-white border-opacity-5 px-4 pt-8 max-w-[720px] hover:border-[#B6A6F3] hover:shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] h-full transition"
                        style={{
                            backgroundImage: `url(${CDN_URL}/assets/utbk/analytics-decor.svg)`,
                            backgroundPosition: 'bottom center',
                            backgroundRepeat: 'no-repeat'
                        }}>
                        <h3 className="flex flex-col gap-4 text-white font-bold text-2xl md:text-3xl leading-[125%]">
                            <span className="uppercase flex gap-2 items-center justify-center font-bold text-[#B6A6F3] text-sm tracking-[0.7px] h-9">
                                <img
                                    src={`${CDN_URL}/assets/utbk/analytics-icon.svg`}
                                    alt="Analytics icon"
                                    width={24}
                                />
                                Analytics
                            </span>
                            Personal Analytics
                        </h3>
                        <p className="text-white text-lg leading-[29.25px] mb-2">
                            Pantau kekuatan dan kelemahanmu secara real-time.
                            Data driven learning untuk hasil yang maksimal.
                        </p>
                        <div className="flex flex-grow items-center">
                            <img
                                src={`${CDN_URL}/assets/utbk/analytics2.avif`}
                                alt="Analytics."
                                height={311}
                                className="h-[311px] sm:h-[362px] lg:h-[389px] object-contain"
                            />
                        </div>
                    </article>
                </li>
            </ul>

            <IRTModal open={showIRTModal} setOpen={setShowIRTModal} />
        </section>
    );
}

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
});
function LanggananItem({
    packet,
    subtitle
}: {
    packet: PacketOffer;
    subtitle?: string;
}): JSX.Element {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    function handleClick(): void {
        if (!isAuthenticated) {
            router.push(`/daftar?redirect=/pembayaran/?packetId=${packet.id}`);
        } else {
            // redirect to pembayaran page
            router.push({
                pathname: '/pembayaran',
                query: { ...router.query, packetId: packet.id }
            });
        }
    }

    return (
        <article
            className={cn(
                'flex flex-col items-center border-2 border-solid border-[#36236A] hover:border-[#5F2BCE] rounded-2xl py-6 relative shadow-[0px_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] transition',
                packet.order === 3 && 'bg-[#36236A] bg-opacity-50'
            )}>
            {packet.order === 3 ? (
                <img
                    src={`${CDN_URL}/assets/utbk/best_value.svg`}
                    alt="Best value."
                    width={88}
                    className="absolute -top-[9px] -right-[3px]"
                />
            ) : null}

            <h3 className="flex flex-col gap-1 text-base leading-[125%] text-white text-center font-bold mb-4">
                {packet.packet_name}
                <span className="font-normal text-xs leading-[140%] -tracking-[0.005em]">
                    {subtitle ?? packet.benefits.info}
                </span>
            </h3>
            <p
                className="mb-8 font-extrabold text-white text-[32px] leading-[125%]"
                style={
                    packet.order === 3
                        ? {
                              background:
                                  'linear-gradient(43.82deg, #CAC7E4 0%, #AB8EEC 28.4%, #DD837A 65.1%, #ECD0CD 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                          }
                        : undefined
                }>
                {rupiahFormatter.format(packet.price as unknown as number)}
                {packet.active_duration ? (
                    <span className="text-[#929292] text-xs leading-[125%] font-bold">
                        {' '}
                        /{packet.active_duration / 30} bln
                    </span>
                ) : null}
            </p>
            <ol className="mb-8 p-0 list-none [&>li>p]:text-white [&>li>p]:font-bold [&>li>p]:text-sm [&>li>p]:leading-[125%] [&>li.disabled>p]:text-[#333333] flex flex-col gap-4 w-full px-6">
                {packet.benefits.data.map((benefit, index) => (
                    <li
                        className="flex gap-3 items-center"
                        key={`${packet.id}-benefit-${index}`}>
                        <FaRegCircleCheck
                            size={24}
                            color={
                                benefit.includes('_CHECK')
                                    ? '#7264EB'
                                    : '#333333'
                            }
                        />
                        <p
                            style={
                                packet.order === 3 && index === 0
                                    ? {
                                          background:
                                              'linear-gradient(43.82deg, #CAC7E4 0%, #AB8EEC 28.4%, #DD837A 65.1%, #ECD0CD 100%)',
                                          WebkitBackgroundClip: 'text',
                                          WebkitTextFillColor: 'transparent',
                                          backgroundClip: 'text'
                                      }
                                    : undefined
                            }>
                            {benefit.split('_CHECK')[0]}
                        </p>
                    </li>
                ))}
            </ol>
            {packet.is_free ? (
                <Button
                    variant="secondary"
                    className="h-[49px] text-[15px] leading-[140%] flex items-center justify-center"
                    href="/daftar">
                    Daftar Gratis
                </Button>
            ) : (
                <Button
                    onClick={handleClick}
                    variant="primary"
                    className="h-[49px] text-[15px] leading-[140%]">
                    Pilih Paket
                </Button>
            )}
        </article>
    );
}

export function Langganan({
    className,
    packetClassName,
    removeFree
}: {
    className?: string;
    packetClassName?: string;
    removeFree?: boolean;
}): JSX.Element {
    const { data } = useGetPacketOfferUTBKQuery();
    return (
        <section className={cn('flex flex-col', className)}>
            <h2 className="flex flex-col items-center text-center gap-3 text-white text-2xl leading-[125%] font-bold mb-3">
                Langganan untuk
                <br className="sm:hidden" /> mengakses semua materi
            </h2>
            <p className="text-[#9CA3AF] text-sm leading-[20px] text-center mb-10">
                Pilih paket yang paling pas buat target UTBK kamu.
            </p>
            <ol
                className={cn(
                    'list-none flex flex-wrap gap-x-4 gap-y-4 md:gap-y-10 max-w-[1082px] justify-center self-center p-0 w-full',
                    packetClassName
                )}>
                {removeFree
                    ? data?.data
                          .filter((packet) => !packet.is_free)
                          .map((packet) => (
                              <li
                                  key={packet.id}
                                  className="w-full max-w-[350px]">
                                  <LanggananItem packet={packet} />
                              </li>
                          ))
                    : data?.data.map((packet) => (
                          <li key={packet.id} className="w-full max-w-[350px]">
                              <LanggananItem packet={packet} />
                          </li>
                      ))}
            </ol>
        </section>
    );
}

function FAQ({ className }: { className?: string }): JSX.Element {
    return (
        <section className={className}>
            <h2 className="flex flex-col items-center text-center gap-3 text-white text-2xl leading-[125%] font-bold mb-3">
                Sering Ditanyakan
            </h2>
            <p className="text-[#9CA3AF] text-sm leading-[20px] text-center mb-10">
                Jawaban untuk pertanyaan seputar persiapan UTBK di Gradient.
            </p>
            <Accordion
                containerClassName="shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] bg-[#181818] transition-colors hover:bg-[#222222]"
                headerClassName="text-left text-white text-base leading-[140%] gap-2 bg-transparent"
                iconClassName="text-[#999999]"
                contentClassName="text-[#DEDEDE] text-sm leading-[160%] bg-transparent"
                item={[
                    {
                        title: 'Apa perbedaan akun Gratis dan Premium?',
                        content:
                            'Akun Gratis bisa digunakan untuk mencoba fitur dasar, seperti contoh soal dan try out terbatas. Akun Premium memberikan akses penuh ke try out harian dan mingguan, pembahasan lengkap, analisis hasil, serta fitur pendukung belajar lainnya.'
                    },
                    {
                        title: 'Apakah sistem penilaian Tryout sesuai standar UTBK terbaru?',
                        content: 'Lorem impsum.'
                    },
                    {
                        title: 'Bagaimana cara kerja Copilot AI Assistant?',
                        content: 'Lorem impsum.'
                    },
                    {
                        title: 'Apakah materi bisa diakses lewat HP?',
                        content: 'Lorem impsum.'
                    },
                    {
                        title: 'Bagaimana jika saya ingin berhenti berlangganan?',
                        content: 'Lorem impsum.'
                    }
                ]}
            />
        </section>
    );
}

function FinalCTA({ className }: { className?: string }): JSX.Element {
    return (
        <section
            className={cn(
                'rounded-3xl border-solid border-[1px] border-white border-opacity-10 py-[40px] px-[43px] sm:px-[29px] max-w-[1028px] self-center w-full flex flex-col',
                className
            )}
            style={{
                background: 'linear-gradient(90deg, #111827 0%, #000000 100%)'
            }}>
            <div className="flex flex-col gap-8 items-center xl:max-w-[676px] sm:max-w-[612px] min-w-[287px] self-center">
                <img
                    src={`${CDN_URL}/assets/utbk/indonesia_asset.svg`}
                    alt="Peta pengguna Gradient di seluruh Indonesia."
                    height={100}
                    className="w-full h-auto"
                />
                <div className="flex flex-col w-full text-center gap-4 z-0">
                    <h2 className="text-white text-3xl font-bold">
                        <span
                            className={cn(
                                'relative inline-flex justify-center',
                                styles['final-cta-decor']
                            )}>
                            200.000+ pelajar
                        </span>
                        <br className="sm:hidden" /> di Indonesia menggunakan
                        <br className="hidden sm:block" /> Gradient
                    </h2>
                    <p className="text-[#9CA3AF]">
                        Daftar untuk mengakses preview materi GRATIS
                    </p>
                    <Button
                        variant="primary"
                        linkClass="h-[52px] sm:max-w-[160px] w-full self-center"
                        className="h-full flex items-center justify-center"
                        href="/daftar">
                        Coba Gratis
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default function UTBK(): JSX.Element {
    return (
        <Layout>
            <div className="flex flex-col w-full">
                <Hero />
                <Testimony
                    className="pt-24 pb-16 gap-[52px]"
                    headerClassName="text-white text-2xl leading-[125%] md:text-3xl"
                    itemHeaderClassName="text-white font-[Raleway,sans-serif] leading-[125%]"
                    itemSubtitleClassName="font-['Open_Sans',sans-serif] leading-[150%]"
                    itemContentClassName="text-white !text-xs !leading-[160%]"
                    noBorder
                />
                <Fitur className="mb-[40px] mx-4" />
                <Langganan className="mb-12 mx-4" />
                <FAQ className="mb-10 mx-4 sm:mx-8 max-w-[736px] self-center w-[calc(100%-32px)] sm:w-[calc(100%-64px)]" />
                <FinalCTA className="sm:mx-8 sm:w-[calc(100%-64px)]" />
            </div>
        </Layout>
    );
}
