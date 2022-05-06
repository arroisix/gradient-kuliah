import { Formik } from 'formik';
import { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { SectionProps } from '.';
import { useRegisterMutation } from 'authentication/redux/api/authApi';

const RegisterSection = ({ changePage }: SectionProps): JSX.Element => {
    const [reveal, setReveal] = useState(false);
    const [register, { isLoading }] = useRegisterMutation();
    return (
        <Formik
            initialValues={{ email: '', password: '', full_name: '' }}
            validate={(values: RegisterInputData) => {
                const errors: RegisterInputData = {} as RegisterInputData;
                if (!values.email) {
                    errors.email = 'Required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        values.email
                    )
                ) {
                    errors.email = 'Email tidak valid';
                }
                if (!values.password) {
                    errors.password = 'Password tidak boleh kosong';
                }

                if (!values.full_name) {
                    errors.full_name = 'Nama lengkap tidak boleh kosong';
                }
                return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
                register(values);
                setSubmitting(false);
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
                        type="text"
                        label="NAMA LENGKAP"
                        placeholder="user"
                        name="fullName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.full_name}
                        error={
                            touched.full_name && errors.full_name
                                ? errors.full_name
                                : undefined
                        }
                    />
                    <Input
                        type="email"
                        label="EMAIL"
                        placeholder="user@gradient.academy"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        error={
                            touched.email && errors.email
                                ? errors.email
                                : undefined
                        }
                    />
                    <Input
                        type={reveal ? 'text' : 'password'}
                        label="PASSWORD"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        error={
                            touched.password && errors.password
                                ? errors.password
                                : undefined
                        }
                        endAddorment={
                            reveal ? (
                                <FaEyeSlash
                                    onClick={() => setReveal(false)}
                                    className="text-gray-500 cursor-pointer"
                                />
                            ) : (
                                <FaEye
                                    onClick={() => setReveal(true)}
                                    className="text-gray-500 cursor-pointer"
                                />
                            )
                        }
                    />

                    <Button
                        variant="custom"
                        className="bg-accent-purple text-white mt-4 w-full"
                        type="submit"
                        disabled={isSubmitting}>
                        {isLoading ? 'Tunggu Sebentar...' : 'Gabung Sekarang'}
                    </Button>

                    <Button
                        variant="tertiary"
                        className="mt-2 w-full"
                        onClick={() => changePage(true)}>
                        <div>
                            <span className="text-black">
                                Sudah punya akun?{' '}
                            </span>
                            <span className="text-accent-purple font-bold">
                                {' '}
                                Masuk
                            </span>
                        </div>
                    </Button>
                </form>
            )}
        </Formik>
    );
};

export default RegisterSection;
