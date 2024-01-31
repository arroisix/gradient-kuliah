import { Formik } from 'formik';
import { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { useLoginMutation } from 'authentication/redux/api/authApi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTracker } from 'tracker/tracker';
import { useLastLogin } from 'authentication/hooks/useLastLogin';
import { FiChevronRight } from 'react-icons/fi';
import { MdAccountCircle } from 'react-icons/md';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useGoogleLogin } from '@react-oauth/google';
import useSocialLogin from 'authentication/hooks/useSocialLogin';
import { toast } from 'react-toastify';

export const LoginSection: React.FC = () => {
    const [reveal, setReveal] = useState(false);
    const [login, { isLoading }] = useLoginMutation();
    const router = useRouter();
    const { setLastLogin, lastLogin } = useLastLogin();
    const [showLastLogin, setShowLastLogin] = useState(!!lastLogin.email);
    const tracker = useTracker();

    const { googleLogin } = useSocialLogin();
    const gLogin =
        typeof window !== 'undefined' &&
        useGoogleLogin({
            onSuccess: async (tokenResponse) => {
                const res = await googleLogin(tokenResponse.access_token);
                if ('data' in res) {
                    setLastLogin({
                        email: res.data.user.email,
                        method: 'google'
                    });
                }
            },
            onError: () => {
                toast.error('Gagal login, coba beberapa saat lagi');
            }
        });

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
                tracker?.trackAttemptFormSubmit('Basic Login', trackedValues);
                const res = await login(values);
                if ('data' in res) {
                    setLastLogin({
                        email: res.data.user.email,
                        method: 'email'
                    });
                }
                setSubmitting(false);
            }}>
            {({
                errors,
                setValues,
                values,
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
                    {!showLastLogin ? (
                        <>
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
                            <Link
                                href="/lupa-password"
                                className="self-end text-sm underline text-neutral-400">
                                Lupa kata sandi?
                            </Link>
                        </>
                    ) : (
                        <section className="flex flex-col">
                            <SelectAccountItem
                                emailOrText={lastLogin.email}
                                icon={() => (
                                    <MdAccountCircle
                                        size={24}
                                        color="#B9B9B9"
                                    />
                                )}
                                method={lastLogin.method}
                                onClick={() => {
                                    tracker?.genericTrack(
                                        'Click Last Used Account',
                                        { Method: lastLogin.method }
                                    );
                                    if (
                                        lastLogin.email &&
                                        lastLogin.method == 'email'
                                    ) {
                                        setShowLastLogin(false);
                                        setValues({
                                            email: lastLogin.email,
                                            password: ''
                                        });
                                    } else if (
                                        lastLogin.method == 'google' &&
                                        gLogin
                                    ) {
                                        gLogin();
                                    }
                                }}
                            />
                            <SelectAccountItem
                                emailOrText="Gunakan akun lain"
                                icon={() => (
                                    <AiFillPlusCircle
                                        size={24}
                                        color="#666666"
                                    />
                                )}
                                method={null}
                                onClick={() => {
                                    setShowLastLogin(false);
                                }}
                            />
                        </section>
                    )}

                    <div className="flex flex-col gap-[14px] flex-grow justify-start">
                        {!showLastLogin && (
                            <Button
                                variant="custom"
                                className="w-full text-white bg-accent-purple"
                                type="submit"
                                disabled={isSubmitting}>
                                {isLoading ? 'Tunggu Sebentar...' : 'Masuk'}
                            </Button>
                        )}

                        <div className="flex justify-center w-full gap-2">
                            <span>Belum punya akun?</span>
                            <Link
                                href={`/daftar${
                                    !!router.query.redirect
                                        ? `?redirect=${router.query.redirect}`
                                        : ''
                                }`}
                                onClick={() => {
                                    tracker?.trackButtonClick(
                                        'Register Button on Login Page',
                                        'Buat Akun'
                                    );
                                }}>
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

function SelectAccountItem({
    onClick,
    icon,
    emailOrText,
    method
}: {
    onClick: () => void;
    emailOrText: string | null;
    method: string | null;
    icon?: () => JSX.Element;
}): JSX.Element {
    const methodMessage =
        method == null
            ? null
            : method == 'email'
            ? 'Login manual'
            : 'Login dengan Google';
    return (
        <button
            type="button"
            onClick={onClick}
            className="py-3 flex justify-between items-center border-solid border-b-[1px] border-b-neutral-800 min-h-[60px]">
            <div className="flex items-center gap-2">
                {!!icon && icon()}
                <p className="flex flex-col gap-[2px] font-body text-sm text-white items-start leading-4 font-semibold">
                    {emailOrText}{' '}
                    {!!methodMessage && (
                        <span className="font-normal text-neutral-400">
                            {methodMessage}
                        </span>
                    )}
                </p>
            </div>
            <FiChevronRight size={20} color="white" />
        </button>
    );
}
