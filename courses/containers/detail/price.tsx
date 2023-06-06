import { useRouter } from 'next/router';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useWindowSize from 'commons/hooks/useWindowSize';
import { formatter } from 'courses/utils';
import { useGetOneCourseManyPacketQuery } from 'payment/redux/api/subscriptionApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Price = ({
    course,
    secondVariant
}: {
    course: Course;
    secondVariant?: boolean;
}): JSX.Element => {
    const { data } = useGetOneCourseManyPacketQuery({ course_id: course.id });
    const router = useRouter();
    const [packet, setPacket] = useState<Packet>();
    const { width } = useWindowSize();
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        if (data && data.data.length > 0) {
            const rawData = [...data.data];
            const sortedData = rawData.sort(
                (a: Packet, b: Packet) => a.active_duration - b.active_duration
            );

            setPacket(sortedData[0]);
        }
    }, [data]);

    const calculatePrice = (): string => {
        if (packet?.price === null) {
            return 'GRATIS';
        }

        return formatter
            .format(packet?.price as unknown as number)
            .split(',')[0];
    };

    return (
        <div className="px-4 md:px-[7.5rem] flex flex-col justify-center items-center my-8 md:my-16 h-[30vh] md:h-[50vh]">
            {secondVariant ? (
                <>
                    <h3 className="text-2xl font-bold text-center md:text-4xl">
                        {width > 768
                            ? 'Jadi Paham Kalkulus 1 bareng Gradient'
                            : '# Jadi Paham Kalkulus 1 bareng Gradient'}
                    </h3>
                    <p className="text-base text-center md:text-xl text-neutral-400 font-body">
                        Gak takut lagi setiap ngeliat ε-δ dan teman temannya
                    </p>
                </>
            ) : (
                <h3 className="text-2xl font-thin text-center md:text-4xl">
                    Akses instan Semuanya Sekarang!
                </h3>
            )}
            {course?.discount && (
                <p className="flex text-xs font-bold text-red-400 line-through">
                    <h2 className="text-3xl text-black md:text-5xl">-</h2>
                    <h2 className="text-[#999999] text-3xl md:text-5xl">
                        {`${
                            formatter
                                .format(
                                    packet?.price_before_discount as unknown as number
                                )
                                .split(',')[0]
                        }/bulan`}
                    </h2>
                    <h2 className="text-3xl text-black md:text-5xl">-</h2>
                </p>
            )}
            <div className="flex items-end gap-2">
                <h3 className="text-2xl font-bold md:text-4xl font-white">
                    {`${calculatePrice()}/bulan`}
                </h3>
                <span className="text-[#7FFDB1] font-bold">
                    ({packet?.discount.split('.')[0]}% OFF)
                </span>
            </div>
            {isAuthenticated && !course.is_subscribed && (
                <Button
                    className="my-2 text-center md:w-fit"
                    variant="primary"
                    href={`/langganan?courseId=${course.id}`}>
                    {secondVariant && width <= 768
                        ? 'Gabung Sekarang'
                        : 'Akses Sekarang'}
                </Button>
            )}
            {!isAuthenticated && !course.is_subscribed && (
                <Button
                    className="my-2 text-center md:w-fit"
                    variant="primary"
                    onClick={
                        // TODO: Implement redirection for `/langganan?courseId=${course.id}`
                        () => router.push('/registrasi')
                    }>
                    {secondVariant && width <= 768
                        ? 'Gabung Sekarang'
                        : 'Akses Sekarang'}
                </Button>
            )}
        </div>
    );
};

export default Price;
