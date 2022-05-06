import { useGetOnePacketOneCourseQuery } from 'payment/redux/api/subscriptionApi';

const usePacket = (id: string) => {
    const { isLoading, error, data } = useGetOnePacketOneCourseQuery(id);

    return { isLoading, error, data };
};

export default usePacket;
