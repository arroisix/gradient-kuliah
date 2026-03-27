import Image from 'next/image';
import Link from 'next/link';

const OtherProductsSection = (): JSX.Element => {
    return (
        <section className="w-full bg-black py-16 md:py-24">
            <div className="max-w-[1280px] mx-auto px-6 md:px-[60px]">
                {/* Title */}
                <h2 className="text-[32px] md:text-[64px] font-bold text-white text-center mb-10 md:mb-20 leading-[1.25]">
                    Jelajahi Produk Gradient Lainnya
                </h2>

                {/* Product Cards */}
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    {/* Gradient Private Card */}
                    <div className="relative w-full md:w-[490px] h-[220px] rounded-2xl border border-[#181818] overflow-hidden">
                        {/* Background */}
                        <div className="absolute inset-0">
                            <Image
                                src="/assets/kuliah/gradient-private-bg.webp"
                                alt=""
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="relative h-full p-6 flex flex-col justify-between">
                            <div className="flex flex-col gap-4 items-start">
                                {/* Logo */}
                                <Image
                                    src="/assets/kuliah/logo-gradient-private.svg"
                                    alt="Gradient Private"
                                    width={220}
                                    height={28}
                                    className="h-7 w-auto"
                                />

                                {/* Description */}
                                <p className="text-[#dedede] text-sm leading-[1.6]">
                                    Platform kelas privat eksklusif dengan tutor
                                    terpilih untuk bantu siswa ambisius tembus
                                    nilai tinggi, jalur kuliah favorit, dan
                                    olimpiade.
                                </p>
                            </div>

                            {/* CTA Button */}
                            <div className="flex justify-end">
                                <Link
                                    href="#"
                                    className="px-5 py-3 bg-white text-accent-purple font-semibold text-base rounded-full hover:bg-white/90 transition-colors">
                                    Kunjungi Website
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Gradient UTBK Card */}
                    <div className="relative w-full md:w-[490px] h-[220px] rounded-2xl border border-[#181818] overflow-hidden bg-black">
                        {/* Purple glow effects */}
                        <div
                            className="absolute -left-[200px] -top-[200px] w-[500px] h-[500px] rounded-full"
                            style={{
                                background: 'rgba(147, 51, 234, 0.25)',
                                filter: 'blur(80px)'
                            }}
                        />
                        <div
                            className="absolute -right-[50px] -bottom-[50px] w-[200px] h-[200px] rounded-full"
                            style={{
                                background: 'rgba(79, 70, 229, 0.2)',
                                filter: 'blur(60px)'
                            }}
                        />

                        {/* Student Image */}
                        <div className="absolute right-0 top-0 w-[280px] h-[250px] opacity-50 mix-blend-lighten">
                            <Image
                                src="/assets/kuliah/utbk-students.png"
                                alt=""
                                layout="fill"
                                objectFit="contain"
                                objectPosition="right top"
                            />
                        </div>

                        {/* Content */}
                        <div className="relative h-full p-6 flex flex-col justify-between">
                            <div className="flex flex-col gap-4 items-start">
                                {/* Logo */}
                                <Image
                                    src="/assets/kuliah/logo-gradient-utbk.svg"
                                    alt="Gradient UTBK"
                                    width={220}
                                    height={28}
                                    className="h-7 w-auto"
                                />

                                {/* Description */}
                                <p className="text-[#dedede] text-sm leading-[1.6]">
                                    Persiapkan dirimu menghadapi SNBT dengan
                                    materi komprehensif dari mahasiswa top
                                    universitas, Try Out rutin, dan pembahasan
                                    soal terlengkap.
                                </p>
                            </div>

                            {/* CTA Button */}
                            <div className="flex justify-end">
                                <Link
                                    href="https://gradient.academy/utbk"
                                    className="px-5 py-3 bg-white text-accent-purple font-semibold text-base rounded-full hover:bg-white/90 transition-colors">
                                    Kunjungi Website
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OtherProductsSection;
