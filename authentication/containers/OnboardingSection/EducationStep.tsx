import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { useContext } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import Select from 'commons/components/elements/Form/select';

export const EducationStep = (): JSX.Element => {
    const { setStep, formData, setFormData } = useContext(RegistrationContext);

    return (
        <div className="flex flex-col w-full">
            <Formik
                initialValues={
                    {
                        education_level: formData.education_level || 'SMP',
                        institution: formData.institution || '',
                        major: formData.major || ''
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
                        errors.education_level = 'Required';
                    if (!values.institution) errors.institution = 'Required';
                    if (!values.major) errors.major = 'Required';

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
                                option={[
                                    {
                                        key: 'SMP',
                                        value: 'SMP'
                                    },
                                    {
                                        key: 'SMA',
                                        value: 'SMA'
                                    },
                                    {
                                        key: 'SMK',
                                        value: 'SMK'
                                    },
                                    {
                                        key: 'S1',
                                        value: 'Sarjana'
                                    },
                                    {
                                        key: 'S2',
                                        value: 'Magister'
                                    },
                                    {
                                        key: 'S3',
                                        value: 'Doktor'
                                    }
                                ]}
                            />
                            <Input
                                type="text"
                                label="Institusi"
                                name="institution"
                                placeholder="ex: UI / SMAN 1 Depok / PT. ABC"
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
                                placeholder="Ilmu Komputer"
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
