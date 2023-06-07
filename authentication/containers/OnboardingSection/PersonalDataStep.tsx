import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { useContext } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import Radio from 'commons/components/elements/Form/radio';

export const PersonalDataStep = (): JSX.Element => {
    const { setStep, formData, setFormData } = useContext(RegistrationContext);

    return (
        <div className="flex flex-col w-full">
            <Formik
                initialValues={
                    {
                        gender: formData.gender || 'MALE',
                        phone_number: formData.phone_number || '',
                        birthdate: formData.birthdate || ''
                    } as UpdateUserInputData
                }
                onSubmit={(values) => {
                    setFormData({
                        ...formData,
                        ...values
                    });
                    setStep(2);
                }}
                validate={(values) => {
                    const errors: { [key: string]: string } = {};

                    if (!values.gender) errors.gender = 'Required';
                    if (!values.birthdate) errors.birthdate = 'Required';
                    if (!values.phone_number) errors.phone_number = 'Required';

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
                            <Input
                                type="date"
                                label="TANGGAL LAHIR"
                                name="birthdate"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.birthdate}
                                error={
                                    touched.birthdate && errors.birthdate
                                        ? errors.birthdate
                                        : undefined
                                }
                                required={true}
                            />
                            <Radio
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.gender}
                                name="gender"
                                label="JENIS KELAMIN"
                                options={[
                                    {
                                        key: 'MALE',
                                        value: 'Laki-Laki'
                                    },
                                    {
                                        key: 'FEMALE',
                                        value: 'Perempuan'
                                    }
                                ]}
                            />
                            <Input
                                type="number"
                                label="NOMOR HANDPHONE"
                                placeholder="8211234567"
                                name="phone_number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                startAddorment={
                                    <span className="text-neutral-400">
                                        +62
                                    </span>
                                }
                                value={values.phone_number}
                                error={
                                    touched.phone_number && errors.phone_number
                                        ? errors.phone_number
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
