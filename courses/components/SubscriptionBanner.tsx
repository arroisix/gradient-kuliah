import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import SubscribeButton from './LandingPage/Common/SubscribeButton';

interface SubscriptionBannerProps {
    slug: string;
}

const Card = (data: any): JSX.Element => {
    console.log(data);

    return (
        <div className="flex flex-col items-center justify-center px-12 py-10 rounded-lg backdrop-blur-sm bg-stone-900/70">
            <div className="flex flex-col">
                <p className="font-light text-center text-sm 2xl:text-xl">
                    Nama Paket
                </p>
                <h3 className="line-through text-2xl font-semibold text-center decoration-4 text-stone-500 decoration-red-600 sm:text-lg 2xl:text-3xl">
                    Harga Sebelom Diskon
                </h3>
                <div className="relative">
                    <h1 className="absolute text-3xl font-bold text-center blur sm:text-2xl 2xl:text-4xl">
                        Harga setelah diskon
                    </h1>
                    <h1 className="relative text-3xl font-bold text-center sm:text-2xl 2xl:text-4xl">
                        Harga lagi bro
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
                <SubscribeButton slug={data.slug} />
            </div>
        </div>
    );
};

const SubscriptionBanner = ({ slug }: SubscriptionBannerProps): JSX.Element => {
    const { data: course } = useGetLandingCourseDataQuery(slug);
    const cardNumber = course?.packets;

    // Coba liat ini di console browser
    console.log(course, 'Data Course');

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen pt-20">
            <div className="flex items-center justify-center relative">
                {/* Bean */}
                <div className="absolute bg-gradient-to-b from-violet-700 w-5/6 rounded-full aspect-square" />

                {/* Cards */}
                <div className="relative">
                    <div className="font-bold text-center text-3xl sm:text-xl">
                        Akses Instan Semuanya Sekarang!
                    </div>
                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-7 mt-5">
                        {cardNumber?.map((cardData) => (
                            <Card {...cardData} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionBanner;
