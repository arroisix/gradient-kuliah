import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import Layout from 'commons/layout';

export default function Career(): JSX.Element {
    return (
        <Layout>
            <section className="min-h-screen pt-24 px-4 md:px-[7.5rem] lg:px-[22rem] mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">Karir</h1>
                <div className="w-full h-full rounded-md p-4 md:p-8 bg-[#121212]  mt-4 md:mt-8 mb-4 md:mb-8  flex flex-col">
                    <p>Pastikan kamu,</p>
                    <h3 className="text-2xl my-4 text-center">
                        Missionary, not Mercenary.
                    </h3>
                    <p>
                        Kami tidak harus membuat harganya murah. Tapi kami
                        melakukannya.
                    </p>
                    <p>
                        Kami tidak harus membuat konten yang indah. Tapi kami
                        melakukannya.
                    </p>
                    <p>
                        Kami tidak harus melewati proses seleksi untuk
                        memastikan konten yang ada mudah dimengerti. Tapi kami
                        melakukannya.
                    </p>
                    <p className="my-4">
                        Ya, nilai yang kami percaya membawa kami untuk melakukan
                        sesuatu yang ekstra. Dan melakukan sesuatu yang ekstra
                        membutuhkan pengorbanan. Pengorbanan dalam bentuk waktu,
                        energi, bahkan uang. Kamu harus bersungguh-sungguh
                        mempercayai visi, memelihara misi, dan siap
                        mendedikasikan hidup untuk orang lain. Jika kamu siap,
                        bergabung bersama kami untuk memikirkan ulang
                        pendidikan.
                    </p>
                    <p>
                        Kamu harus bersungguh-sungguh mempercayai visi,
                        memelihara misi, dan siap mendedikasikan hidup untuk
                        orang lain. Jika kamu siap, bergabung bersama kami untuk
                        memikirkan ulang pendidikan.
                    </p>
                </div>
                <div className="w-full h-full rounded-md p-4 md:p-8 bg-[#121212] mb-8 flex flex-col md:flex-row items-center md:justify-between">
                    <h3 className="font-bold mb-2 md:mb-0">Hubungi Kami</h3>
                    <Link href="https://api.whatsapp.com/send?phone=+6281310028280">
                        <div className="flex rounded-full px-4 py-2 bg-[#0F460F]">
                            <span className="text-base font-bold flex items-center">
                                <FaWhatsapp className="mr-2 text-xl" />
                                Gabung Gradient
                            </span>
                        </div>
                    </Link>
                </div>
            </section>
        </Layout>
    );
}
