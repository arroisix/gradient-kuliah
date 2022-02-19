import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../schema';

const useUpdate = () => {
    const [updateFun, { data, loading, error }] = useMutation(UPDATE_USER, {
        errorPolicy: 'all'
    });

    return {
        updateAction: updateFun,
        updateData: data,
        updateLoading: loading,
        updateError: error
    };
};

export default useUpdate;
