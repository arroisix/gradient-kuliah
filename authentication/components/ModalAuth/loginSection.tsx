import { Formik } from 'formik';
import { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { SectionProps } from '.';
import { useLoginMutation } from 'authentication/redux/api/authApi';

const LoginSection = ({ changePage }: SectionProps): JSX.Element => {
    const [reveal, setReveal] = useState(false);
    const [login, { isLoading }] = useLoginMutation();
    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validate={(values: LoginInputData) => {
                const errors: LoginInputData = {} as LoginInputData;
                if (!values.email) {
                    errors.email = 'Required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        values.email
                    )
                ) {
                    errors.email = 'Invalid email address';
                }
                if (!values.password) {
                    errors.password = 'Required';
                }
                return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
                await login(values);
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
                /* and other goodies */
            }) => (
                <form onSubmit={handleSubmit} className="container">
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
                        {isLoading ? 'Tunggu Sebentar...' : 'Masuk Sekarang'}
                    </Button>

                    <Button
                        variant="tertiary"
                        className="mt-2 w-full"
                        onClick={() => changePage(false)}>
                        <div>
                            <span className="text-black">
                                Belum punya akun?{' '}
                            </span>
                            <span className="text-accent-purple font-bold">
                                {' '}
                                Buat Akun
                            </span>
                        </div>
                    </Button>
                </form>
            )}
        </Formik>
    );
};

export default LoginSection;
