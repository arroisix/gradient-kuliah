import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import { formatter } from 'courses/utils';
import SubscribeButton from './SubscribeButton';

interface SubscriptionBannerProps {
    slug: string;
    title?: string;
}

interface CardProps {
    benefits: {
        data: string[];
        info: string;
    };
    is_free: boolean;
    price: string;
    packet_name: string;
    price_before_discount: string;
    slugProp: string;
}

const Card = ({
    benefits,
    packet_name,
    price,
    price_before_discount,
    is_free,
    slugProp
}: CardProps): JSX.Element => {
    return (
        <div className="grid grid-cols-1 place-items-center w-3/5 py-10 sm:w-80 rounded-lg backdrop-blur-sm bg-stone-900/70">
            <div className="flex flex-col">
                <p className="font-light text-center text-sm 2xl:text-xl">
                    {packet_name}
                </p>
                <h3 className="line-through text-2xl font-semibold text-center decoration-4 text-stone-500 decoration-red-600 sm:text-lg 2xl:text-3xl">
                    {
                        formatter
                            .format(price_before_discount as unknown as number)
                            .split(',')[0]
                    }
                </h3>
                <div className="relative">
                    <h1 className="absolute text-3xl font-bold text-center blur sm:text-2xl 2xl:text-4xl">
                        {
                            formatter
                                .format(price as unknown as number)
                                .split(',')[0]
                        }
                    </h1>
                    <h1 className="relative text-3xl font-bold text-center sm:text-2xl 2xl:text-4xl">
                        {is_free
                            ? 'GRATIS'
                            : formatter
                                  .format(price as unknown as number)
                                  .split(',')[0]}
                    </h1>
                </div>
            </div>
            <ul className="grid grid-cols-1 content-center pt-4 px-12">
                {benefits?.data.map((benefit: string) => (
                    <li
                        className="text-xs sm:text-xs 2xl:text-base"
                        key={benefit}>
                        {benefit}
                    </li>
                ))}
            </ul>
            <div className="flex flex-col items-center justify-center pt-4">
                <p className="mb-3 text-xs 2xl:text-sm">{benefits?.info}</p>
                <SubscribeButton slug={slugProp} />
            </div>
        </div>
    );
};

const SubscriptionBanner = ({
    slug,
    title
}: SubscriptionBannerProps): JSX.Element => {
    const { data: course } = useGetLandingCourseDataQuery(slug);
    const cardNumber = course?.packets;

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-screen">
            <div className="flex items-center justify-center relative">
                {/* Bean */}
                <div className="absolute bg-gradient-to-b from-violet-700 w-2/3 rounded-full aspect-square" />

                {/* Cards */}
                <div className="relative">
                    <h1 className="md:text-center text-2xl md:text-4xl font-bold text-center">
                        {title ?? 'Akses Instan Semuanya Sekarang!'}
                    </h1>
                    <div className="flex gap-2 flex-wrap mt-8 justify-center items-center">
                        {cardNumber?.map((cardData: Packet) => (
                            <Card
                                {...cardData}
                                key={cardData.id}
                                slugProp={slug}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionBanner;
