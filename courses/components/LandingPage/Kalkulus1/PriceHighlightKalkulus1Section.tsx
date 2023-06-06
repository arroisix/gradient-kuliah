import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useWindowSize from 'commons/hooks/useWindowSize';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import { formatter } from 'courses/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PriceHighlightKalkulus1Section = ({
    slug,
    is_second_variant
}: {
    slug: string;
    is_second_variant?: boolean;
}): JSX.Element => {
    const { data: course } = useGetLandingCourseDataQuery(slug);
    const { is_subscribed } = useCourseSubscription(slug);
    const [packet, setPacket] = useState<Packet>();
    const { width } = useWindowSize();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (course && course.packets.length > 0) {
            const rawData = [...course.packets];
            const sortedData = rawData.sort(
                (a: Packet, b: Packet) => a.active_duration - b.active_duration
            );

            setPacket(sortedData[0]);
        }
    }, [course]);

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
            {is_second_variant ? (
                <>
                    <h3 className="text-2xl font-bold text-center md:text-4xl">
                        {width > 768
                            ? 'Jadi Paham Kalkulus bareng Gradient'
                            : '# Jadi Paham Kalkulus bareng Gradient'}
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
            {packet?.discount.split('.')[0] !== '0' && (
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
            {isAuthenticated && !is_subscribed && (
                <Button
                    className="my-2 text-center md:w-fit"
                    variant="primary"
                    href={`/langganan?courseId=${course?.course_id}`}>
                    {is_second_variant && width <= 768
                        ? 'Gabung Sekarang'
                        : 'Akses Sekarang'}
                </Button>
            )}
            {!isAuthenticated && !is_subscribed && (
                <Button
                    className="my-2 text-center md:w-fit"
                    variant="primary"
                    onClick={
                        // TODO: Implement redirection for `/langganan?courseId=${course?.course_id}`
                        () => router.push('/masuk')
                    }>
                    {is_second_variant && width <= 768
                        ? 'Gabung Sekarang'
                        : 'Akses Sekarang'}
                </Button>
            )}
        </div>
    );
};

export default PriceHighlightKalkulus1Section;
