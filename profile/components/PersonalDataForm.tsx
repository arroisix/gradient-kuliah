import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import Radio from 'commons/components/elements/Form/radio';
import Spinner from 'commons/components/elements/Spinner';
import { Formik } from 'formik';
import {
    ReduxHTTPError,
    useProfileContext
} from 'profile/contexts/ProfileProvider';
import { toast } from 'react-toastify';

export const PersonalDataForm = (): JSX.Element => {
    const { isLoading, updateUser, profile } = useProfileContext();
    return (
        <Formik
            initialValues={
                {
                    gender: profile?.gender || 'MALE',
                    phone_number: profile?.phone_number
                        ? profile?.phone_number.replace('+62', '')
                        : '',
                    birthdate: profile?.birthdate
                        ? profile?.birthdate.split('T')[0]
                        : ''
                } as UpdateUserResponseData
            }
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const payload = {
                    ...profile,
                    ...values
                };

                if (values.phone_number.substring(0, 1) === '0') {
                    payload.phone_number = values.phone_number.replace('0', '');
                } else if (values.phone_number.substring(0, 2) === '62') {
                    payload.phone_number = values.phone_number.replace(
                        '62',
                        ''
                    );
                }

                const result = await updateUser(payload);

                if (!(result as ReduxHTTPError).error) {
                    toast.success(`Perubahan berhasil disimpan`, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }

                setSubmitting(false);
            }}
            validate={(values) => {
                const errors: { [key: string]: string } = {};

                if (!values.gender)
                    errors.gender = 'Jenis kelamin tidak boleh kosong';
                if (!values.birthdate)
                    errors.birthdate = 'Tanggal lahir tidak boleh kosong';
                if (!values.phone_number) {
                    errors.phone_number = 'Nomor handphone tidak boleh kosong';
                } else if (values.phone_number.length < 10) {
                    errors.phone_number = 'Masukkan nomor handphone yang valid';
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
                initialValues
            }) => (
                <form onSubmit={handleSubmit} className="container">
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
                                <span className="text-neutral-400">+62</span>
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
                        disabled={isLoading || initialValues === values}
                        variant="custom"
                        className="w-full mt-4 text-white bg-accent-purple"
                        type="submit">
                        {isLoading ? <Spinner size="small" /> : 'Simpan'}
                    </Button>
                </form>
            )}
        </Formik>
    );
};
