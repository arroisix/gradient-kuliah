import {
    EDUCATION_OPTIONS,
    PROFESSION_OPTIONS
} from 'authentication/constants';
import { useOptionLoader } from 'authentication/hooks/useOptionLoader';
import Button from 'commons/components/elements/Button';
import Select from 'commons/components/elements/Form/select';
import Spinner from 'commons/components/elements/Spinner';
import { Formik } from 'formik';
import {
    ReduxHTTPError,
    useProfileContext
} from 'profile/contexts/ProfileProvider';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTracker } from 'tracker/tracker';

export const EducationLevelForm = (): JSX.Element => {
    const tracker = useTracker();

    const { isLoading, updateUser, profile } = useProfileContext();

    const {
        options: institutionOption,
        setOptions: setInstitutionOption,
        loadOptions: loadInstitutionOption
    } = useOptionLoader('institute');
    const {
        options: majorOption,
        setOptions: setMajorOption,
        loadOptions: loadMajorOption
    } = useOptionLoader('major');
    const {
        options: professionFieldOption,
        loadOptions: loadProfessionFieldOption
    } = useOptionLoader('industry');

    const getHandleSelectChange = (
        fieldName: string,
        setFieldValue: (arg1: string, arg2: any) => void
    ) => {
        return (newValue: string) => {
            setFieldValue(fieldName, newValue);
        };
    };

    useEffect(() => {
        tracker?.genericTrack('Visit Onboarding Education Step');

        loadInstitutionOption('');
        loadMajorOption('');

        return () => {
            setInstitutionOption([]);
            setMajorOption([]);
        };
    }, []);

    return (
        <Formik
            initialValues={
                {
                    education_level: profile?.education_level || '',
                    institution: profile?.institution || '',
                    major: profile?.major || '',
                    profession: profile?.profession || '',
                    profession_field: profile?.profession_field || ''
                } as UpdateUserResponseData
            }
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const payload = {
                    ...profile,
                    ...values
                };

                if (payload.profession !== 'employed') {
                    payload.profession_field = '';
                }

                tracker?.trackAttemptFormSubmit(
                    'Education Profile Data',
                    payload
                );

                const result = await updateUser(payload);

                if (!(result as ReduxHTTPError).error) {
                    toast.success(`Perubahan berhasil disimpan`, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }

                setSubmitting(false);
            }}
            validate={(values) => {
                const errors: { [key: string]: string } = {};

                if (!values.education_level)
                    errors.education_level =
                        'Tingkat pendidikan tidak boleh kosong';
                if (!values.institution)
                    errors.institution =
                        'Asal sekolah/universitas tidak boleh kosong';
                if (!values.major) errors.major = 'Jurusan tidak boleh kosong';
                if (!values.profession)
                    errors.profession = 'Pekerjaan tidak boleh kosong';
                if (
                    values.profession === 'employed' &&
                    !values.profession_field
                )
                    errors.profession_field =
                        'Bidang pekerjaan tidak boleh kosong';

                return errors;
            }}>
            {({
                values,
                errors,
                touched,
                initialValues,
                handleSubmit,
                setFieldValue
            }) => (
                <form onSubmit={handleSubmit} className="container">
                    <div className="flex flex-col gap-4">
                        <Select
                            onChange={getHandleSelectChange(
                                'education_level',
                                setFieldValue
                            )}
                            label="Tingkat Pendidikan"
                            name="educationLevel"
                            option={EDUCATION_OPTIONS}
                            placeholder="Pilih pendidikan"
                            initialValue={values.education_level}
                            error={
                                touched.education_level &&
                                errors.education_level
                                    ? errors.education_level
                                    : undefined
                            }
                        />
                        <Select
                            onChange={getHandleSelectChange(
                                'institution',
                                setFieldValue
                            )}
                            isAsync
                            loadOption={loadInstitutionOption}
                            isCreatable
                            name="institution"
                            option={institutionOption}
                            label={
                                values.education_level === 'SMP' ||
                                values.education_level === 'SMA'
                                    ? 'Asal Sekolah'
                                    : 'Asal Universitas/Institusi'
                            }
                            placeholder={
                                values.education_level === 'SMP' ||
                                values.education_level === 'SMA'
                                    ? 'Pilih asal sekolah'
                                    : 'Pilih asal universitas/institusi'
                            }
                            initialValue={values.institution}
                            error={
                                touched.institution && errors.institution
                                    ? errors.institution
                                    : undefined
                            }
                        />
                        {values.education_level !== 'SMP' && (
                            <Select
                                onChange={getHandleSelectChange(
                                    'major',
                                    setFieldValue
                                )}
                                isAsync
                                loadOption={loadMajorOption}
                                isCreatable
                                label="Jurusan"
                                name="major"
                                option={majorOption}
                                placeholder="Pilih jurusan"
                                initialValue={values.major}
                                error={
                                    touched.major && errors.major
                                        ? errors.major
                                        : undefined
                                }
                            />
                        )}
                        <Select
                            onChange={getHandleSelectChange(
                                'profession',
                                setFieldValue
                            )}
                            label="Pekerjaan"
                            name="profession"
                            option={PROFESSION_OPTIONS}
                            placeholder="Pilih pekerjaan"
                            initialValue={values.profession}
                            error={
                                touched.profession && errors.profession
                                    ? errors.profession
                                    : undefined
                            }
                        />
                        {values.profession === 'employed' && (
                            <Select
                                onChange={getHandleSelectChange(
                                    'profession_field',
                                    setFieldValue
                                )}
                                isAsync
                                loadOption={loadProfessionFieldOption}
                                name="institution"
                                option={professionFieldOption}
                                label="Bidang Pekerjaan"
                                placeholder="Pilih bidang pekerjaan"
                                initialValue={values.profession_field}
                                error={
                                    touched.profession_field &&
                                    errors.profession_field
                                        ? errors.profession_field
                                        : undefined
                                }
                            />
                        )}
                    </div>
                    <Button
                        disabled={isLoading || initialValues === values}
                        variant="custom"
                        className="w-full mt-4 text-white bg-accent-purple"
                        type="submit">
                        {isLoading ? <Spinner size="small" /> : 'Simpan'}
                    </Button>
                </form>
            )}
        </Formik>
    );
};
