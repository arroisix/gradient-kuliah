import { Formik } from 'formik';
import moment from 'moment';
import { useAuth } from 'src/authentication/contexts/AuthProvider';
import Button from 'src/commons/components/elements/Button';
import Input from 'src/commons/components/elements/Form/input';
import Radio from 'src/commons/components/elements/Form/radio';
import Select from 'src/commons/components/elements/Form/select';

const FormSection = ({
    openDialog
}: {
    openDialog: (status: 1 | 0) => void;
}): JSX.Element => {
    const { loading, update } = useAuth();
    return (
        <Formik
            initialValues={{} as UpdateUserInputType}
            // validate={(values: UpdateUserInputType) => {
            //       const errors: UpdateUserInputType = {} as UpdateUserInputType;
            //     return errors;
            // }}
            onSubmit={async (values, { setSubmitting }) => {
                await update({
                    ...values,
                    birthdate: moment(values.birthdate).format('YYYY-MM-DD'),
                    phoneNumber: values.phoneNumber?.toString()
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
                /* and other goodies */
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
                                    name: 'educationLevel'
                                }
                            })
                        }
                        onBlur={handleBlur}
                        label="TINGKAT PENDIDIKAN"
                        value={values.educationLevel}
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
                        name="phoneNumber"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        startAddorment={<p className="text-neutral-200">+62</p>}
                        value={values.phoneNumber}
                        error={errors.phoneNumber}
                    />

                    <Button
                        variant="custom"
                        className="bg-accent-purple text-white mt-4 w-full"
                        type="submit"
                        disabled={isSubmitting}>
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                    {/* <Button
                        variant="tertiary"
                        className="mt-2 w-full"
                        onClick={() => console.log('wkw')}>
                        <div>Lewati</div>
                    </Button> */}
                </form>
            )}
        </Formik>
    );
};

export default FormSection;
