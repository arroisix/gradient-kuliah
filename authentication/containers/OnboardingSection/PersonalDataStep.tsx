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
        <div className="flex flex-col w-full">
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
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
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
                                        value: 'Laki-Laki'
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
                        <div className="fixed left-0 md:left-auto bottom-16 px-[16px] md:px-0 w-full md:w-[400px]">
                            <Button
                                variant="custom"
                                className="w-full mt-4 text-white bg-accent-purple"
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
