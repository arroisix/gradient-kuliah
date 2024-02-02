import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import { useContext, useEffect } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import Select from 'commons/components/elements/Form/select';
import {
    EDUCATION_OPTIONS,
    PROFESSION_OPTIONS
} from 'authentication/constants';
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

        //loadInstitutionOption('');
        //loadMajorOption('');

        return () => {
            setInstitutionOption([]);
            setMajorOption([]);
        };
    }, []);

    return (
        <div className="flex flex-col w-full">
            <Formik
                initialValues={
                    {
                        education_level: formData.education_level || '',
                        institution: formData.institution || '',
                        major: formData.major || '',
                        profession: formData.profession || '',
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
                    if (!values.major)
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
                    isValid: isFormValid,
                }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-4">
                                <Select
                                    onChange={getHandleSelectChange(
                                        'education_level',
                                        setFieldValue
                                    )}
                                    label="Tingkat Pendidikan"
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
                                            : 'Asal Universitas/Institusi'
                                    }
                                    placeholder={
                                        values.education_level === 'SMP' ||
                                        values.education_level === 'SMA' ||
                                        values.education_level === 'SMK'
                                            ? 'Tuliskan asal sekolah'
                                            : 'Tuliskan asal universitas/institusi'
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
                                <Select
                                    onChange={getHandleSelectChange(
                                        'profession',
                                        setFieldValue
                                    )}
                                    label="Pekerjaan"
                                    name="profession"
                                    option={PROFESSION_OPTIONS}
                                    initialValue={values.profession}
                                    placeholder="Tuliskan pekerjaan"
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
                                        initialValue={values.profession_field}
                                        placeholder="Tuliskan bidang pekerjaan"
                                        error={
                                            touched.profession_field &&
                                            errors.profession_field
                                                ? errors.profession_field
                                                : undefined
                                        }
                                    />
                                )}
                            </div>
                            <div className="fixed left-0 md:left-auto bottom-16 px-[16px] md:px-0 w-full md:w-[400px]">
                                <Button
                                    disabled={(
                                        !values.education_level ||
                                        !values.institution ||
                                        !values.major ||
                                        !values.profession ||
                                        (values.profession === 'employed' && !values.profession_field)
                                    ) || !isFormValid}
                                    variant="custom"
                                    className="w-full mt-4 text-white bg-accent-purple"
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
