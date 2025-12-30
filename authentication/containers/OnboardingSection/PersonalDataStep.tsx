import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { useContext, useEffect } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import Radio from 'commons/components/elements/Form/radio';
import { useTracker } from 'tracker/tracker';

export const PersonalDataStep = (): JSX.Element => {
    const { setStep, formData, setFormData } = useContext(RegistrationContext);

    const tracker = useTracker();

    useEffect(() => {
        tracker?.genericTrack('Visit Onboarding Personal Data Step');
    }, []);

    return (
        <div className="flex flex-col w-full max-w-[360px]">
            <h1 className="mb-10 text-2xl font-bold">Data Pribadi</h1>
            <Formik
                initialValues={
                    {
                        gender: formData.gender || 'MALE',
                        phone_number: formData.phone_number
                            ? formData.phone_number.replace('+62', '')
                            : '',
                        birthdate: formData.birthdate
                            ? formData.birthdate.split('T')[0]
                            : ''
                    } as UpdateUserInputData
                }
                onSubmit={(values) => {
                    const payload = {
                        ...formData,
                        ...values
                    };

                    if (values.phone_number?.substring(0, 1) === '0') {
                        payload.phone_number = values.phone_number.replace(
                            '0',
                            ''
                        );
                    } else if (values.phone_number?.substring(0, 2) === '62') {
                        payload.phone_number = values.phone_number.replace(
                            '62',
                            ''
                        );
                    }

                    setFormData(payload);

                    setStep(2);
                }}
                validate={(values) => {
                    const errors: { [key: string]: string } = {};

                    if (!values.gender)
                        errors.gender = 'Jenis kelamin tidak boleh kosong';
                    if (!values.birthdate)
                        errors.birthdate = 'Tanggal lahir tidak boleh kosong';
                    if (!values.phone_number) {
                        errors.phone_number =
                            'Nomor handphone tidak boleh kosong';
                    } else if (values.phone_number.length < 10) {
                        errors.phone_number =
                            'Masukkan nomor handphone yang valid';
                    }

                    return errors;
                }}>
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isValid: isFormValid
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <Input
                                type="date"
                                label="Tanggal Lahir"
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
                                label="Jenis Kelamin"
                                options={[
                                    {
                                        key: 'MALE',
                                        value: 'Laki-laki'
                                    },
                                    {
                                        key: 'FEMALE',
                                        value: 'Perempuan'
                                    }
                                ]}
                            />
                            <Input
                                type="tel"
                                label="Nomor Handphone"
                                placeholder="8211234567"
                                name="phone_number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                startAddorment={
                                    <span className="text-white">+62</span>
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
                        <div>
                            <Button
                                disabled={
                                    !values.birthdate ||
                                    !values.gender ||
                                    !values.phone_number ||
                                    values.phone_number === '' ||
                                    !isFormValid
                                }
                                variant="custom"
                                className="w-full mt-10 text-white bg-accent-purple h-[46px]"
                                type="submit">
                                Selanjutnya
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
};
