import { useState } from 'react';
import { useLazyGetStudentRecommendationQuery } from 'authentication/redux/api/authApi';
import { SelectProps } from 'commons/components/elements/Form/select';

export const useOptionLoader = (
    fieldName: 'major' | 'institute' | 'industry'
) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [fetchRecommendation] = useLazyGetStudentRecommendationQuery();

    const loadOptions: SelectProps['loadOption'] = (input, callback) => {
        fetchRecommendation({
            fieldName,
            input
        }).then((query) => {
            let options =
                query.data?.map((item) => ({
                    value: item.name,
                    label: item.name
                })) ?? [];

            setOptions(options);
            callback?.(options);
        });
    };

    return { options, setOptions, loadOptions };
};
