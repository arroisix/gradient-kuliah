import { useQuery } from '@apollo/client';
import { GET_PRIVATE_DETAIL_COURSE } from '../schema';

const useCourseDetail = (id: string) => {
    const { loading, error, data } = useQuery(GET_PRIVATE_DETAIL_COURSE, {
        variables: {
            id
        },
        errorPolicy: 'all'
    });

    return { loading, error, data };
};

export default useCourseDetail;
