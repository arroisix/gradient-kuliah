import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useWindowSize from 'commons/hooks/useWindowSize';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import { formatter } from 'courses/utils';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AUTHENTICATION_ROUTE } from 'commons/constants';
import Link from 'next/link';

const PriceHighlightPTSLSection = ({
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

    useEffect(() => {
        if (course && course.packets.length > 0) {
            const rawData = [...course.packets];
            const sortedData = rawData.sort(
                (a: Packet, b: Packet) => a.active_duration - b.active_duration
            );

            setPacket(sortedData[0]);
        }
    }, [course]);

    return (
        <div className="px-4 md:px-[7.5rem] flex flex-col justify-center items-center my-8 md:my-16 h-[30vh] md:h-[50vh]">
            <>
                <h3 className="text-2xl font-bold text-center md:text-4xl">
                    Kenalin Jurusanmu Lebih Dekat
                </h3>
                <p className="text-base text-center md:text-xl text-neutral-400 font-body">
                    Dengar cerita unik dari yang berpengalaman di bidang sipil &
                    lingkungan
                </p>
            </>
            {packet?.discount?.split('.')[0] !== '0' && (
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
                    GRATIS
                </h3>
                <span className="text-[#7FFDB1] font-bold">
                    ({packet?.discount?.split('.')[0]}% OFF)
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
                <Link
                    href={`${AUTHENTICATION_ROUTE}?redirect=/langganan?courseId=${course?.course_id}`}>
                    <Button
                        className="my-2 text-center md:w-fit"
                        variant="primary">
                        {is_second_variant && width <= 768
                            ? 'Gabung Sekarang'
                            : 'Akses Sekarang'}
                    </Button>
                </Link>
            )}
        </div>
    );
};

export default PriceHighlightPTSLSection;
