import { CDN_URL } from 'commons/constants';
import { cn } from 'commons/utils';
import IRTModal from 'landing/components/utbk/IRTModal';
import Link from 'next/link';
import { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

interface FiturProps {
    className?: string;
}

export default function Fitur({ className }: FiturProps): JSX.Element {
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
                Platform <i>all-in-one</i> dengan fitur canggih untuk memastikan
                kamu siap tempur di hari H!
            </p>

            <ul className="list-none gap-6 max-w-[1200px] self-center p-0 grid grid-cols-1 lg:grid-cols-2">
                <li>
                    <article
                        className="flex flex-col gap-4 text-center bg-[#181818] rounded-[32px] border-solid border-[1px] border-white border-opacity-5 px-4 pt-8 max-w-[720px] hover:border-[#B6A6F3] hover:shadow-[0px_8px_12px_6px_rgba(0,0,0,0.15),0px_4px_4px_rgba(0,0,0,0.3)] items-center h-full transition relative overflow-hidden"
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
                            Video Materi dari Mahasiswa Top Universitas
                        </h3>

                        <p className="text-white text-lg leading-[29.25px]">
                            Akses ratusan jam konten video yang dibawakan
                            langsung oleh mahasiswa dari UI, ITB, dan lainnya.
                            Penjelasan santai, mudah dimengerti, dan{' '}
                            <i>to-the-point.</i>
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
                            UTBK asli. Menggunakan sistem penilaian{' '}
                            <i>Item Response Theory (IRT)</i> untuk akurasi skor
                            tinggi.
                        </p>
                        <button
                            className="mb-2 text-[#B6A6F3] font-semibold text-sm leading-[125%] h-[34px] flex items-center gap-1"
                            type="button"
                            onClick={() => setShowIRTModal(true)}>
                            Apa itu IRT?
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
                            penjelasan materi yang belum kamu pahami!
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
                            Pantau kekuatan dan kelemahanmu secara{' '}
                            <i>real-time</i>. <i>Data driven learning</i> untuk
                            hasil yang maksimal.
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
