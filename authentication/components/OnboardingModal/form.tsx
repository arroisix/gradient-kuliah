import { Formik } from 'formik';
import moment from 'moment';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import Radio from 'commons/components/elements/Form/radio';
import Select from 'commons/components/elements/Form/select';
import { useUpdateUserMutation } from 'authentication/redux/api/authApi';

const FormSection = ({
    openDialog
}: {
    openDialog: (status: 1 | 0) => void;
}): JSX.Element => {
    const [update, { isLoading }] = useUpdateUserMutation();
    return (
        <Formik
            initialValues={{} as UpdateUserInputData}
            onSubmit={async (values, { setSubmitting }) => {
                await update({
                    ...values,
                    birthdate: moment(values.birthdate).format('YYYY-MM-DD'),
                    phone_number: values.phone_number?.toString()
                });
                setSubmitting(false);
                openDialog(1);
            }}>
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
            }) => (
                <form onSubmit={handleSubmit} className="container">
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
                                ? errors.birthdate
                                : undefined
                        }
                    />
                    <Input
                        type="number"
                        label="NOMOR HANDPHONE"
                        placeholder="8211234567"
                        name="phone_number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        startAddorment={<p className="text-neutral-200">+62</p>}
                        value={values.phone_number}
                        error={errors.phone_number}
                    />

                    <Button
                        variant="custom"
                        className="bg-accent-purple text-white mt-4 w-full"
                        type="submit"
                        disabled={isSubmitting}>
                        {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </form>
            )}
        </Formik>
    );
};

export default FormSection;
