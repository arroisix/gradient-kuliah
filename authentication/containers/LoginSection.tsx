import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import {
    useGetProfileQuery,
    useLoginMutation
} from 'authentication/redux/api/authApi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { SerializedError } from '@reduxjs/toolkit';

interface ReduxHttpError {
    error: FetchBaseQueryError | SerializedError;
}

export const LoginSection: React.FC = () => {
    const [state, setState] = useState({
        reveal: false,
        skip: true
    });
    const [login, { isLoading }] = useLoginMutation();
    const { data: profile } = useGetProfileQuery({}, { skip: state.skip });
    const router = useRouter();

    useEffect(() => {
        if (!!profile) {
            if (!profile.username) {
                router.push('/onboarding');
            } else {
                router.push('/kelas');
            }
        }
    }, [profile, router]);

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
                const result = await login(values);
                setSubmitting(false);

                if (!(result as ReduxHttpError).error) {
                    setState({
                        ...state,
                        skip: false
                    });
                }
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
                    className="container flex flex-col gap-3">
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
                            type={state.reveal ? 'text' : 'password'}
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
                                state.reveal ? (
                                    <FaEyeSlash
                                        onClick={() =>
                                            setState({
                                                ...state,
                                                reveal: false
                                            })
                                        }
                                        className="text-gray-500 cursor-pointer"
                                    />
                                ) : (
                                    <FaEye
                                        onClick={() =>
                                            setState({
                                                ...state,
                                                reveal: true
                                            })
                                        }
                                        className="text-gray-500 cursor-pointer"
                                    />
                                )
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            variant="custom"
                            className="w-full text-white bg-accent-purple"
                            type="submit"
                            disabled={isSubmitting}>
                            {isLoading
                                ? 'Tunggu Sebentar...'
                                : 'Masuk Sekarang'}
                        </Button>

                        <div className="flex justify-center w-full gap-2">
                            <span>Belum punya akun?</span>
                            <Link href={'/registrasi'}>
                                <span className="font-extrabold text-[#7264EB] cursor-pointer hover:text-[#7264EB]/75 transition-all duration-500">
                                    Buat Akun
                                </span>
                            </Link>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
};
