import { useGetOneCourseManyPacketQuery } from 'payment/redux/api/subscriptionApi';

const usePacket = (id: string) => {
    const { isLoading, error, data } = useGetOneCourseManyPacketQuery({
        course_id: id,
        add_to_cart: true
    });

    return { isLoading, error, data };
};

export default usePacket;
