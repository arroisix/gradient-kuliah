import { Formik } from 'formik';
import { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { useRegisterMutation } from 'authentication/redux/api/authApi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';
import { sendGTMEvent } from '@next/third-parties/google';

export const RegistrationSection: React.FC = () => {
    const [reveal, setReveal] = useState(false);
    const [register, { isLoading }] = useRegisterMutation();
    const router = useRouter();
    const tracker = useTracker();

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validate={(values: AuthInputData) => {
                const errors: AuthInputData = {} as AuthInputData;
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
                const { password: _password, ...trackedValues } = values;
                tracker?.trackAttemptFormSubmit(
                    'Basic Register',
                    trackedValues
                );
                const response = await register(values).unwrap();
                if (response.is_new_user) {
                    sendGTMEvent({
                        event: 'new_register',
                        email: response.user.email
                    });
                }
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
                <form
                    onSubmit={handleSubmit}
                    className="container flex flex-col gap-[14px] h-full">
                    <div className="flex flex-col gap-4">
                        <Input
                            type="email"
                            placeholder="Email"
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
                            placeholder="Password"
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
                            className="highlight-ignore"
                        />
                    </div>

                    <div className="flex flex-col gap-[14px] flex-grow justify-start">
                        <Button
                            variant="custom"
                            className="w-full text-white bg-accent-purple"
                            type="submit"
                            disabled={isSubmitting}>
                            {isLoading ? 'Tunggu Sebentar...' : 'Buat Akun'}
                        </Button>

                        <p className="text-xs text-center">
                            Dengan membuat akun, Anda menyetujui{' '}
                            <Link
                                className="font-bold text-[#7264EB] underline cursor-pointer hover:text-[#7264EB]/75 transition-all duration-500"
                                href={'/syarat-dan-ketentuan'}>
                                Syarat &amp; Ketentuan
                            </Link>{' '}
                            dan{' '}
                            <Link
                                className="font-bold text-[#7264EB] underline cursor-pointer hover:text-[#7264EB]/75 transition-all duration-500"
                                href={'/kebijakan-privasi'}>
                                Kebijakan Privasi
                            </Link>{' '}
                            Gradient
                        </p>

                        <div className="flex justify-center w-full gap-2 mt-8">
                            <span>Sudah punya akun?</span>
                            <Link
                                href={`/masuk${
                                    !!router.query.redirect
                                        ? `?redirect=${router.query.redirect}`
                                        : ''
                                }`}
                                onClick={() => {
                                    tracker?.trackButtonClick(
                                        'Login Button on Register Page',
                                        'Login'
                                    );
                                }}>
                                <span className="font-extrabold text-[#7264EB] cursor-pointer hover:text-[#7264EB]/75 transition-all duration-500">
                                    Login
                                </span>
                            </Link>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
};
