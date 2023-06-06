import { useRouter } from 'next/router';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useWindowSize from 'commons/hooks/useWindowSize';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import { formatter } from 'courses/utils';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PriceHighlightPTSLSection = ({
    slug,
    is_second_variant
}: {
    slug: string;
    is_second_variant?: boolean;
}): JSX.Element => {
    const { data: course } = useGetLandingCourseDataQuery(slug);
    const { is_subscribed } = useCourseSubscription(slug);
    const router = useRouter();
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
                <h3 className="font-bold text-2xl md:text-4xl text-center">
                    Kenalin Jurusanmu Lebih Dekat
                </h3>
                <p className="text-base md:text-xl text-neutral-400 font-body text-center">
                    Dengar cerita unik dari yang berpengalaman di bidang sipil &
                    lingkungan
                </p>
            </>
            {packet?.discount?.split('.')[0] !== '0' && (
                <p className="font-bold text-xs line-through text-red-400 flex">
                    <h2 className="text-3xl md:text-5xl text-black">-</h2>
                    <h2 className="text-[#999999] text-3xl md:text-5xl">
                        {`${
                            formatter
                                .format(
                                    packet?.price_before_discount as unknown as number
                                )
                                .split(',')[0]
                        }/bulan`}
                    </h2>
                    <h2 className="text-3xl md:text-5xl text-black">-</h2>
                </p>
            )}
            <div className="flex items-end gap-2">
                <h3 className="font-bold text-2xl md:text-4xl font-white">
                    GRATIS
                </h3>
                <span className="text-[#7FFDB1] font-bold">
                    ({packet?.discount?.split('.')[0]}% OFF)
                </span>
            </div>
            {isAuthenticated && !is_subscribed && (
                <Button
                    className="md:w-fit text-center my-2"
                    variant="primary"
                    href={`/langganan?courseId=${course?.course_id}`}>
                    {is_second_variant && width <= 768
                        ? 'Gabung Sekarang'
                        : 'Akses Sekarang'}
                </Button>
            )}
            {!isAuthenticated && !is_subscribed && (
                <Button
                    className="md:w-fit text-center my-2"
                    variant="primary"
                    onClick={
                        // TODO: Implement redirection for `/langganan?courseId=${course?.course_id}`
                        () => router.push('/registrasi')
                    }>
                    {is_second_variant && width <= 768
                        ? 'Gabung Sekarang'
                        : 'Akses Sekarang'}
                </Button>
            )}
        </div>
    );
};

export default PriceHighlightPTSLSection;
