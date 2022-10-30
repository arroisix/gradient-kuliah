import { Formik } from 'formik';
import moment from 'moment';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import Radio from 'commons/components/elements/Form/radio';
import Select from 'commons/components/elements/Form/select';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { useContext } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';

const RegistrationSection = (): JSX.Element => {
    const user = useSelector(getCurrentUser);

    const { setStep, formData, setFormData } = useContext(RegistrationContext);

    return (
        <div className="w-full flex flex-col">
            <Formik
                initialValues={
                    {
                        gender: formData.gender || 'MALE',
                        education_level: formData.education_level || 'SMP',
                        phone_number: formData.phone_number || '',
                        institution: formData.institution || '',
                        birthdate: formData.birthdate || ''
                    } as UpdateUserInputData
                }
                onSubmit={(values) => {
                    setFormData({
                        ...formData,
                        ...values,
                        birthdate: moment(values.birthdate).format(
                            'YYYY-MM-DD'
                        ),
                        phone_number: values.phone_number?.toString(),
                        full_name: user.full_name
                    });
                    setStep(1);
                }}
                validate={(values) => {
                    const errors: { [key: string]: string } = {};

                    if (!values.gender) errors.gender = 'Required';
                    if (!values.education_level)
                        errors.education_level = 'Required';
                    if (!values.institution) errors.institution = 'Required';
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
                        <h1 className="text-3xl text-center font-bold mb-8">
                            Lengkapi Akunmu
                        </h1>
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
                            label="TINGKAT PENDIDIKAN"
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
                                }
                            ]}
                        />
                        <Input
                            type="text"
                            label="INSTITUSI"
                            name="institution"
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
                            type="number"
                            label="NOMOR HANDPHONE"
                            placeholder="8211234567"
                            name="phone_number"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            startAddorment={
                                <p className="text-neutral-200">+62</p>
                            }
                            value={values.phone_number}
                            error={
                                touched.phone_number && errors.phone_number
                                    ? errors.phone_number
                                    : undefined
                            }
                            required={true}
                        />
                        <Button
                            variant="custom"
                            className="bg-accent-purple text-white mt-4 w-full"
                            type="submit">
                            Selanjutnya
                        </Button>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default RegistrationSection;
