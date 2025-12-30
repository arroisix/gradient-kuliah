import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import { useContext, useEffect } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import Select from 'commons/components/elements/Form/select';
import { EDUCATION_OPTIONS } from 'authentication/constants';
import { useTracker } from 'tracker/tracker';
import { useOptionLoader } from 'authentication/hooks/useOptionLoader';

export const EducationStep = (): JSX.Element => {
    const { setStep, formData, setFormData } = useContext(RegistrationContext);

    const tracker = useTracker();

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

        //loadInstitutionOption('');
        //loadMajorOption('');

        return () => {
            setInstitutionOption([]);
            setMajorOption([]);
        };
    }, []);

    return (
        <div className="flex flex-col w-full max-w-[360px]">
            <h1 className="mb-10 text-2xl font-bold">Isi Detail Pendidikan</h1>
            <Formik
                initialValues={
                    {
                        education_level: formData.education_level || '',
                        institution: formData.institution || '',
                        major: formData.major || '',
                        profession: formData.profession || 'student',
                        profession_field: formData.profession_field || ''
                    } as UpdateUserInputData
                }
                onSubmit={(values) => {
                    setFormData({
                        ...formData,
                        ...values
                    });
                    setStep(3);
                }}
                validate={(values) => {
                    const errors: { [key: string]: string } = {};

                    if (!values.education_level)
                        errors.education_level =
                            'Tingkat pendidikan tidak boleh kosong';
                    if (!values.institution)
                        errors.institution =
                            'Asal sekolah/universitas tidak boleh kosong';
                    if (values.education_level !== 'SMP' && !values.major)
                        errors.major = 'Jurusan tidak boleh kosong';
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
                    handleSubmit,
                    setFieldValue,
                    isValid: isFormValid
                }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <Select
                                    onChange={getHandleSelectChange(
                                        'education_level',
                                        setFieldValue
                                    )}
                                    label="Tingkat Pendidikan Sekarang"
                                    name="educationLevel"
                                    option={EDUCATION_OPTIONS}
                                    initialValue={values.education_level}
                                    placeholder="Tuliskan pendidikan"
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
                                    initialValue={values.institution}
                                    label={
                                        values.education_level === 'SMP' ||
                                        values.education_level === 'SMA' ||
                                        values.education_level === 'SMK'
                                            ? 'Asal Sekolah'
                                            : 'Asal Kampus'
                                    }
                                    placeholder={
                                        values.education_level === 'SMP' ||
                                        values.education_level === 'SMA' ||
                                        values.education_level === 'SMK'
                                            ? 'Tuliskan asal sekolah'
                                            : 'Tuliskan asal kampus'
                                    }
                                    error={
                                        touched.institution &&
                                        errors.institution
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
                                        initialValue={values.major}
                                        placeholder="Tuliskan jurusan"
                                        error={
                                            touched.major && errors.major
                                                ? errors.major
                                                : undefined
                                        }
                                    />
                                )}
                            </div>
                            <div>
                                <Button
                                    disabled={
                                        !values.education_level ||
                                        !values.institution ||
                                        (values.education_level !== 'SMP' &&
                                            !values.major) ||
                                        !values.profession ||
                                        (values.profession === 'employed' &&
                                            !values.profession_field) ||
                                        !isFormValid
                                    }
                                    variant="custom"
                                    className="w-full mt-10 text-white bg-accent-purple h-[46px]"
                                    type="submit">
                                    Selanjutnya
                                </Button>
                            </div>
                        </form>
                    );
                }}
            </Formik>
        </div>
    );
};
