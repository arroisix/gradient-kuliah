import { useGetOneCourseManyPacketQuery } from 'payment/redux/api/subscriptionApi';

const usePacket = (id: string) => {
    const { isLoading, error, data } = useGetOneCourseManyPacketQuery(id);

    return { isLoading, error, data };
};

export default usePacket;
