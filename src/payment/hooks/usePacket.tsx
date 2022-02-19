import { useQuery } from '@apollo/client';
import { GET_COURSE_PACKET } from '../schema';

const usePacket = (id: string) => {
    const { loading, error, data } = useQuery(GET_COURSE_PACKET, {
        variables: {
            id
        },
        errorPolicy: 'all'
    });

    return { loading, error, data };
};

export default usePacket;
