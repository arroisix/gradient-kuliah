import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import SubscribeButton from './LandingPage/Common/SubscribeButton';

interface SubscriptionBannerProps {
    slug: string;
}

const Card = ({benefits,
                discount,
                packet_name,
                price,
                price_before_discount,
                slugProp}:{
                    benefits:object;
                    discount:any;
                    packet_name:any;
                    price:any;
                    price_before_discount:any;
                    slugProp:any;
                }): JSX.Element => {
    
    const benefitList:object=benefits.data
    const paymentPeriodInfo:string=benefits.info
    
    return (
        <div className="grid grid-cols-1 place-items-center w-3/5 py-10 sm:w-80 rounded-lg backdrop-blur-sm bg-stone-900/70">
            <div className="flex flex-col">
                <p className="font-light text-center text-sm 2xl:text-xl">
                    {packet_name}
                </p>
                <h3 className="line-through text-2xl font-semibold text-center decoration-4 text-stone-500 decoration-red-600 sm:text-lg 2xl:text-3xl">
                    {`Rp.${price_before_discount}`}
                </h3>
                <div className="relative">
                    <h1 className="absolute text-3xl font-bold text-center blur sm:text-2xl 2xl:text-4xl">
                        {`Rp.${price}`}
                    </h1>
                    <h1 className="relative text-3xl font-bold text-center sm:text-2xl 2xl:text-4xl">
                        {`Rp.${price}`}
                    </h1>
                </div>
            </div>
            <ul className="grid grid-cols-1 content-center pt-4">
                {benefitList.map((benefit)=> (
                    <li className="text-xs sm:text-xs 2xl:text-base">
                        {benefit}
                    </li>
                ))}
            </ul>
            <div className="flex flex-col items-center justify-center pt-4">
                <p className="mb-3 text-xs 2xl:text-sm">
                    {paymentPeriodInfo}
                </p>
                <SubscribeButton slug={slugProp} />
            </div>
        </div>
    );
};

const SubscriptionBanner = ({ slug }: SubscriptionBannerProps): JSX.Element => {
    const { data: course } = useGetLandingCourseDataQuery(slug);
    const cardNumber = course?.packets;
    const slugData = course?.course_slug;
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
                    <div className="grid md:grid-cols-2 place-items-center sm:grid-cols-1 gap-7 mt-5">
                        {cardNumber?.map((cardData) => (
                            <Card {...cardData} slugProp={slugData} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionBanner;