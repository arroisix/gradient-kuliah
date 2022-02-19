import { useQuery } from '@apollo/client';
import { GET_PRIVATE_COURSE } from '../schema';

const useCourses = () => {
    const { loading, error, data } = useQuery(GET_PRIVATE_COURSE, {
        errorPolicy: 'all'
    });

    return { loading, error, data };
};

export default useCourses;
