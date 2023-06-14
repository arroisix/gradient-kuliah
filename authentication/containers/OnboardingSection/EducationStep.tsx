import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { useContext } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import Select from 'commons/components/elements/Form/select';
import {
    EDUCATION_OPTIONS,
    PROFESSION_OPTIONS
} from 'authentication/constants';

export const EducationStep = (): JSX.Element => {
    const { setStep, formData, setFormData } = useContext(RegistrationContext);

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
                    handleChange,
                    handleBlur,
                    handleSubmit
                }) => (
                    <form onSubmit={handleSubmit} className="container">
                        <div className="flex flex-col gap-4">
                            <Select
                                onChange={(e) =>
                                    handleChange({
                                        target: {
                                            value: e.target.value,
                                            name: 'education_level'
                                        }
                                    })
                                }
                                onBlur={handleBlur}
                                label="Tingkat Pendidikan"
                                value={values.education_level}
                                name="educationLevel"
                                option={EDUCATION_OPTIONS}
                            />
                            <Input
                                type="text"
                                label="Asal Sekolah/Universitas"
                                name="institution"
                                placeholder="Nama sekolah atau universitas"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.institution}
                                error={
                                    touched.institution && errors.institution
                                        ? errors.institution
                                        : undefined
                                }
                                required={true}
                            />
                            <Input
                                type="text"
                                label="Jurusan"
                                name="major"
                                placeholder="Nama jurusan"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.major}
                                error={
                                    touched.major && errors.major
                                        ? errors.major
                                        : undefined
                                }
                                required={true}
                            />
                            <Select
                                onChange={(e) =>
                                    handleChange({
                                        target: {
                                            value: e.target.value,
                                            name: 'profession'
                                        }
                                    })
                                }
                                onBlur={handleBlur}
                                label="Pekerjaan"
                                value={values.profession}
                                name="profession"
                                option={PROFESSION_OPTIONS}
                            />
                            {values.profession === 'employed' && (
                                <Input
                                    type="text"
                                    label="Bidang Pekerjaan"
                                    name="profession_field"
                                    placeholder="Nama bidang"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.profession_field}
                                    error={
                                        touched.profession_field &&
                                        errors.profession_field
                                            ? errors.profession_field
                                            : undefined
                                    }
                                    required={values.profession === 'employed'}
                                />
                            )}
                        </div>
                        <Button
                            variant="custom"
                            className="w-full mt-4 text-white bg-accent-purple"
                            type="submit">
                            Selanjutnya
                        </Button>
                    </form>
                )}
            </Formik>
        </div>
    );
};
