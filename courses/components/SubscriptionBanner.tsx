const SubscriptionBanner = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="flex items-center justify-center relative">
                {/* Bean */}
                <div className="absolute bg-gradient-to-b from-violet-700 w-5/6 rounded-full aspect-square"></div>

                {/* Cards */}
                <div className="relative">
                    <div className="font-bold text-center text-3xl sm:text-xl">
                        Akses Instan Semuanya Sekarang!
                    </div>
                    <div className="grid grid-cols-2 gap-7 mt-5">
                        <div className="flex flex-col items-center justify-center px-12 py-10 rounded-lg backdrop-blur-sm bg-stone-900/70 md:px-10 sm:px-7 sm:py-10 2xl:px-18 2xl:py-14">
                            <div className="flex flex-col">
                                <p className="font-light text-center text-sm 2xl:text-xl">
                                    Paket 4 Bulan
                                </p>
                                <h3 className="line-through text-2xl font-semibold text-center decoration-4 text-stone-500 decoration-red-600 sm:text-lg 2xl:text-3xl">
                                    Rpxxx.000/bulan
                                </h3>
                                <div className="relative">
                                    <h1 className="absolute text-3xl font-bold text-center blur sm:text-2xl 2xl:text-4xl">
                                        Rp.xx.000/bulan
                                    </h1>
                                    <h1 className="relative text-3xl font-bold text-center sm:text-2xl 2xl:text-4xl">
                                        Rp.xx.000/bulan
                                    </h1>
                                </div>
                            </div>
                            <ul className="flex flex-col pt-4">
                                <li className="text-sm sm:text-xs 2xl:text-base">
                                    100+ Video Pembelajaran
                                </li>
                                <li className="text-sm sm:text-xs 2xl:text-base">
                                    Latihan Soal dan Pembahasan
                                </li>
                                <li className="text-sm sm:text-xs 2xl:text-base">
                                    Dedicated Tutor
                                </li>
                                <li className="text-sm sm:text-xs 2xl:text-base">
                                    Webinar Gradient tanggal
                                </li>
                            </ul>
                            <div className="flex flex-col items-center justify-center pt-4">
                                <p className="mb-3 text-xs 2xl:text-sm">
                                    *Pembayaran langsung 4 bulan
                                </p>
                                <button
                                    type="button"
                                    className="bg-violet-700 px-7 py-2 rounded-full font-semibold 2xl:text-xl 2xl:px-9 2xl:py-2">
                                    Akses Sekarang
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center px-12 py-10 rounded-lg backdrop-blur-sm bg-stone-900/70 md:px-10 sm:px-6 sm:py-5">
                            <div className="flex flex-col">
                                <p className="font-light text-center text-sm 2xl:text-xl">
                                    Paket 4 Bulan
                                </p>
                                <h3 className="line-through text-2xl font-semibold text-center decoration-4 text-stone-500 decoration-red-600 sm:text-lg 2xl:text-3xl">
                                    Rpxxx.000/bulan
                                </h3>
                                <h1 className="relative text-3xl font-bold text-center sm:text-2xl 2xl:text-4xl">
                                    Rp.xx.000/bulan
                                </h1>
                            </div>
                            <ul className="flex flex-col pt-4">
                                <li className="text-sm sm:text-xs 2xl:text-base">
                                    100+ Video Pembelajaran
                                </li>
                                <li className="text-sm sm:text-xs 2xl:text-base">
                                    Latihan Soal dan Pembahasan
                                </li>
                                <li className="text-sm sm:text-xs 2xl:text-base">
                                    Dedicated Tutor
                                </li>
                                <li className="text-sm sm:text-xs 2xl:text-base">
                                    Webinar Gradient tanggal
                                </li>
                            </ul>
                            <div className="flex flex-col items-center justify-center pt-4">
                                <p className="mb-3 text-xs 2xl:text-sm">
                                    *Pembayaran langsung 4 bulan
                                </p>
                                <button
                                    type="button"
                                    className="bg-zinc-900 px-7 py-2 rounded-full font-semibold 2xl:text-xl 2xl:px-9 2xl:py-2">
                                    Akses Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionBanner;
