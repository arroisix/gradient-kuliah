import { useState } from 'react';
import { useLazyGetStudentRecommendationQuery } from 'authentication/redux/api/authApi';
import { SelectProps } from 'commons/components/elements/Form/select';

export const useOptionLoader = (
    fieldName: 'major' | 'institute' | 'industry'
) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [fetchRecommendation] = useLazyGetStudentRecommendationQuery();

    const loadOptions: SelectProps['loadOption'] = (input, callback) => {
        fetchRecommendation(
            {
                fieldName,
                input
            },
            true
        ).then((query) => {
            const options =
                query.data?.map((item) => ({
                    value: item.name,
                    label: item.name
                })) ?? [];

            setOptions(options);
            callback?.(options);
        });
    };

    const loadTargetOptions: (
        institution_id?: string,
        major_id?: string
    ) => SelectProps['loadOption'] = (institution_id, major_id) => {
        return function (input, callback) {
            fetchRecommendation(
                {
                    is_search_target: true,
                    fieldName,
                    input,
                    institution_id,
                    major_id
                },
                true
            ).then((query) => {
                const options: Option[] =
                    query.data?.map((item) => ({
                        value: `${item.id}:${item.name}`,
                        label: item.name,
                        passing_grade: item?.passing_grade
                    })) ?? [];

                setOptions(options);
                callback?.(options);
            });
        };
    };

    return { options, setOptions, loadOptions, loadTargetOptions };
};
