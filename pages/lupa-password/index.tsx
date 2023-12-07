import { NextPage } from 'next';
import { FaChevronLeft } from 'react-icons/fa';
import { HiOutlineInbox } from 'react-icons/hi2';
import Link from 'next/link';
import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { usePasswordResetMutation } from 'authentication/redux/api/authApi';
import { useEffect, useState } from 'react';

const Form = ({ setIsSuccess }: { setIsSuccess: (value: boolean) => void }) => {
    const [showRegister, setShowRegister] = useState(false);
    const [forgotPassword, { isLoading, isSuccess }] =
        usePasswordResetMutation();

    useEffect(() => {
        setIsSuccess(isSuccess);
    }, [isSuccess]);
    return (
        <Formik
            initialValues={{ email: '' }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
                forgotPassword(values)
                    .unwrap()
                    .then(() => {
                        setShowRegister(false);
                    })
                    .catch((errors) => {
                        if (errors.status === 400) {
                            setErrors({
                                email: 'Nomor yang kamu ketik tidak teregistrasi. Butuh bantuan?'
                            });
                            setShowRegister(true);
                        } else {
                            throw errors;
                        }
                    });
                setSubmitting(false);
            }}
            validate={(values) => {
                const errors: Record<string, string> = {};
                if (!values.email) {
                    errors.email = 'Tidak boleh kosong';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        values.email
                    )
                ) {
                    errors.email = 'Alamat email tidak valid';
                }
                return errors;
            }}>
            {({
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                values
            }) => (
                <form
                    onSubmit={handleSubmit}
                    className="h-full flex flex-col justify-center">
                    <div className="flex flex-col gap-6 mb-10 min-h-[450px]">
                        <Link
                            href="/masuk"
                            className="flex items-center gap-2 text-[#666666] text-sm font-body">
                            <FaChevronLeft size={12} /> Balik
                        </Link>

                        <h5 className="text-white text-xl md:text-2xl font-bold">
                            Lupa Kata Sandi
                        </h5>
                        <p className="text-white opacity-50 font-body text-xs md:text-sm">
                            Masukan email yang terkait dengan akun kamu dan kami
                            akan mengirimkan email berisi petunjuk untuk
                            mengatur ulang password kamu.
                        </p>

                        <Input
                            type="email"
                            placeholder="foo@bar.com"
                            name="email"
                            label="Email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            error={
                                touched.email && errors.email
                                    ? errors.email
                                    : undefined
                            }
                        />
                    </div>
                    <div className="flex items-end md:items-start">
                        <div className="flex flex-col w-full gap-5 md:gap-8">
                            <Button
                                variant="custom"
                                type="submit"
                                className="w-full !py-[10px] md:!py-[14px] text-sm md:text-base bg-accent-purple rounded-full text-white md:leading-5"
                                disabled={isSubmitting}>
                                {isLoading
                                    ? 'Tunggu Sebentar...'
                                    : 'Kirim Email'}
                            </Button>
                            {showRegister && (
                                <>
                                    <Separator text="atau" />
                                    <Button
                                        type="button"
                                        variant="custom"
                                        className="w-full !py-[10px] md:!py-[14px] text-sm md:text-base bg-[#242424] rounded-full text-white md:leading-5">
                                        Buat Akun
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
};

const Separator = ({ text }: { text: string }) => {
    return (
        <div className="flex gap-3 items-center text-neutral-600">
            <div className="h-[1px] bg-neutral-600 flex-grow"></div>
            {text}
            <div className="h-[1px] bg-neutral-600 flex-grow"></div>
        </div>
    );
};

const Waiting = () => (
    <section className="flex justify-center h-full flex-col gap-10">
        <div className="flex flex-col gap-6 items-center">
            <div className="bg-[rgba(255,255,255,0.10)] text-white rounded-full p-4">
                <HiOutlineInbox size={40} />
            </div>
            <h5 className="text-white text-xl md:text-2xl font-bold">
                Periksa Email Kamu
            </h5>
            <p className="font-body text-sm md:text-base text-white opacity-50 text-center">
                Kami telah mengirimkan instruksi pemulihan kata sandi ke email
                kamu.
            </p>
        </div>
        <div className="flex items-end md:items-start">
            <Button
                variant="custom"
                className="text-center !py-[10px] md:!py-[14px] text-sm md:text-base bg-accent-purple rounded-full text-white md:leading-5"
                linkClass="w-full"
                href="/masuk">
                Kembali
            </Button>
        </div>
    </section>
);

const LupaPassword: NextPage = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    return (
        <main className="min-h-screen text-white bg-neutral-1000 flex justify-center">
            <div className="max-w-[325px] mx-[18px] mt-20 mb-12">
                {isSuccess ? <Waiting /> : <Form setIsSuccess={setIsSuccess} />}
            </div>
        </main>
    );
};

LupaPassword.displayName = 'Lupa Password';
export default LupaPassword;
