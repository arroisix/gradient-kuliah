import { useAuth } from 'authentication/contexts/AuthProvider';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import { dayToMonth, formatter } from 'courses/utils';
import { useGetOneCourseManyPacketQuery } from 'payment/redux/api/subscriptionApi';
import { useSelector } from 'react-redux';
import Price from './price';

const TablePrice = ({ course }: { course: Course }): JSX.Element => {
    const { setModalAuthOpen } = useAuth();
    const { data } = useGetOneCourseManyPacketQuery({ course_id: course.id });
    const isAuthenticated = useSelector(getIsAuthenticated);

    if (data?.data.length === 1) {
        return <Price course={course} />;
    }

    return (
        <div className="px-4 md:px-[7.5rem] flex flex-col justify-center items-center my-8 md:my-16">
            <h2 className="text-2xl md:text-4xl">
                Akses Instan Semuanya Sekarang!
            </h2>
            <div className="my-4 w-full flex justify-center items-center">
                {data?.data.map((packet: Packet) => (
                    <div
                        className="flex flex-col text-center overflow-hidden first:rounded-l-lg last:rounded-r-lg"
                        key={packet.id}>
                        <div className="px-2 md:px-12 py-2 bg-[#373737]">
                            <h5 className="text-base md:text-2xl font-bold">
                                {dayToMonth(packet.active_duration)}
                            </h5>
                        </div>
                        <div className="px-2 md:px-12 py-2 bg-[#1D1D1D]">
                            <p className="line-through text-red-400 flex">
                                <h5 className="text-[16px] md:text-[22px] font-body font-thin text-[#999999]">
                                    {
                                        formatter
                                            .format(
                                                packet?.price_before_discount as unknown as number
                                            )
                                            .split(',')[0]
                                    }
                                </h5>
                            </p>
                        </div>
                        <div className="px-2 md:px-12 py-2 bg-[#1D1D1D]">
                            <h5 className="text-[16px] md:text-[22px] font-body font-[400]">
                                {
                                    formatter
                                        .format(
                                            packet?.price as unknown as number
                                        )
                                        .split(',')[0]
                                }
                            </h5>
                        </div>
                    </div>
                ))}
            </div>
            {isAuthenticated && !course.is_subscribed && (
                <Button
                    className="md:w-fit text-center my-2"
                    variant="primary"
                    href={`/langganan?courseId=${course.id}`}>
                    Akses Sekarang
                </Button>
            )}
            {!isAuthenticated && !course.is_subscribed && (
                <Button
                    className="md:w-fit text-center my-z"
                    variant="primary"
                    onClick={() =>
                        setModalAuthOpen(
                            1,
                            false,
                            `/langganan?courseId=${course.id}`
                        )
                    }>
                    Akses Sekarang
                </Button>
            )}
        </div>
    );
};

export default TablePrice;
