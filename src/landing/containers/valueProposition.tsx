import { Parallax } from 'react-scroll-parallax';

const ValueProposition = (): JSX.Element => {
    return (
        <div className="flex flex-col w-full">
            <div className="hidden md:flex w-full mb-8">
                <Parallax speed={10} style={{ width: '100%' }}>
                    <div className="w-full h-screen flex items-center justify-center p-[7.25rem]">
                        <h3 className="text-4xl text-neutral-600 font-bold">
                            <span className="text-white">
                                Harga terjangkau.
                            </span>{' '}
                            Kamu bisa beli satu kelas hanya dari Rp50.000 aja.
                        </h3>
                    </div>
                </Parallax>
                <Parallax speed={-3} style={{ width: '100%' }}>
                    <div className="w-full h-screen sticky-card sticky-1 p-4">
                        <div className="h-full w-full bg-neutral-400"></div>
                    </div>
                </Parallax>
            </div>
            <div className="hidden md:flex w-full mb-8">
                <Parallax speed={10} style={{ width: '100%' }}>
                    <div className="w-full h-screen flex items-center justify-center  p-[7.25rem]">
                        <h3 className="text-4xl text-neutral-600 font-bold">
                            <span className="text-white">
                                Video berkualitas tinggi
                            </span>{' '}
                            dengan penjelasan yang mudah dipahami dan ramah
                            kuota internet.
                        </h3>
                    </div>
                </Parallax>
                <Parallax speed={-3} style={{ width: '100%' }}>
                    <div className="w-full h-screen sticky-card sticky-2">
                        <div className="h-full w-full bg-neutral-400"></div>
                    </div>
                </Parallax>
            </div>
            <div className="hidden md:flex w-full mb-8">
                <Parallax speed={10} style={{ width: '100%' }}>
                    <div className="w-full h-screen flex items-center justify-center  p-[7.25rem]">
                        <h3 className="text-4xl text-neutral-600 font-bold">
                            <span className="text-white">
                                Artikel dan Latihan Soal Lengkap.
                            </span>{' '}
                            Artikel buat referensi nugas, latihan soal buat
                            persiapan ujian.
                        </h3>
                    </div>
                </Parallax>
                <Parallax speed={-3} style={{ width: '100%' }}>
                    <div className="w-full h-screen sticky-card sticky-3">
                        <div className="h-full w-full bg-neutral-400"></div>
                    </div>
                </Parallax>
            </div>

            <div className="flex flex-col-reverse md:hidden w-full mb-8">
                <div className="w-full flex items-center justify-center">
                    <h3 className="text-2xl text-neutral-600 font-bold p-4">
                        <span className="text-white">Harga terjangkau.</span>{' '}
                        Kamu bisa beli satu kelas hanya dari Rp50.000 aja.
                    </h3>
                </div>
                <div className="w-full h-[70vh] sticky-card sticky-1 p-4">
                    <div className="h-full w-full bg-neutral-400"></div>
                </div>
            </div>
            <div className="flex flex-col-reverse md:hidden w-full mb-8">
                <div className="w-full flex items-center justify-center p-4">
                    <h3 className="text-2xl text-neutral-600 font-bold">
                        <span className="text-white">
                            Video berkualitas tinggi
                        </span>{' '}
                        dengan penjelasan yang mudah dipahami dan ramah kuota
                        internet.
                    </h3>
                </div>
                <div className="w-full h-[70vh] sticky-card sticky-2">
                    <div className="h-full w-full bg-neutral-400"></div>
                </div>
            </div>
            <div className="flex flex-col-reverse md:hidden w-full mb-8">
                <div className="w-full flex items-center justify-center  p-4">
                    <h3 className="text-2xl text-neutral-600 font-bold">
                        <span className="text-white">
                            Artikel dan Latihan Soal Lengkap.
                        </span>{' '}
                        Artikel buat referensi nugas, latihan soal buat
                        persiapan ujian.
                    </h3>
                </div>
                <div className="w-full h-[70vh] sticky-card sticky-3">
                    <div className="h-full w-full bg-neutral-400"></div>
                </div>
            </div>
        </div>
    );
};

export default ValueProposition;
