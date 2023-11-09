import withAnon from 'commons/withAnon';
import { NextPage } from 'next';
import { FaChevronLeft } from 'react-icons/fa';
import { HiShieldCheck } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import {
    usePasswordResetValidateTokenMutation,
    usePasswordResetConfirmMutation
} from 'authentication/redux/api/authApi';
import { useEffect, useState } from 'react';

const Form = ({ setIsSuccess }: { setIsSuccess: (value: boolean) => void }) => {
    const router = useRouter();
    const [confirmPassword, { isSuccess, isLoading }] =
        usePasswordResetConfirmMutation();

    useEffect(() => {
        if (isSuccess) {
            setIsSuccess(true);
        }
    }, [isSuccess, setIsSuccess]);
    return (
        <Formik
            initialValues={{ newPassword: '', confirmNewPassword: '' }}
            onSubmit={async (values, { setSubmitting }) => {
                await confirmPassword({
                    password: values.newPassword,
                    token: router.query.token as string
                });
                setSubmitting(false);
            }}
            validate={(values) => {
                const errors: Record<string, string> = {};
                if (!values.newPassword) {
                    errors.newPassword = 'Tidak boleh kosong';
                }
                if (!values.confirmNewPassword) {
                    errors.confirmNewPassword = 'Tidak boleh kosong';
                }

                if (values.newPassword !== values.confirmNewPassword) {
                    errors.confirmNewPassword = 'Kata sandi harus sama';
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
                    <div className="flex flex-col gap-6 mb-10">
                        <Link
                            href="/masuk"
                            className="flex items-center gap-2 text-[#666666] text-sm font-body">
                            <FaChevronLeft size={12} /> Balik
                        </Link>

                        <h5 className="text-white text-xl md:text-2xl font-bold">
                            Perbarui Kata Sandi
                        </h5>
                        <p className="text-white opacity-50 font-body text-xs md:text-sm">
                            Masukkan kata sandi baru yang akan kamu gunakan.
                            Kata sandi baru tidak bisa sama seperti yang lama.
                        </p>

                        <div className="flex flex-col gap-6">
                            <Input
                                type="password"
                                placeholder="Masukan kata sandi"
                                autoComplete="new-password"
                                name="newPassword"
                                label="Kata sandi baru"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.newPassword}
                                error={
                                    touched.newPassword && errors.newPassword
                                        ? errors.newPassword
                                        : undefined
                                }
                            />

                            <Input
                                type="password"
                                placeholder="Ketik ulang kata sandi"
                                autoComplete="off"
                                name="confirmNewPassword"
                                label="Ketik ulang kata sandi baru"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirmNewPassword}
                                error={
                                    touched.confirmNewPassword &&
                                    errors.confirmNewPassword
                                        ? errors.confirmNewPassword
                                        : undefined
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-grow md:flex-grow-0 items-end md:items-start">
                        <div className="flex flex-col w-full gap-5 md:gap-8">
                            <Button
                                variant="custom"
                                type="submit"
                                className="w-full !py-[10px] md:!py-[14px] text-sm md:text-base bg-accent-purple rounded-full text-white md:leading-5"
                                disabled={isSubmitting}>
                                {isLoading ? 'Tunggu Sebentar...' : 'Perbarui'}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
};

const Success = () => (
    <section className="flex justify-center h-full flex-col gap-10">
        <div className="flex flex-col gap-6 items-center">
            <div className="bg-[rgba(255,255,255,0.10)] text-white rounded-full p-4">
                <HiShieldCheck size={40} />
            </div>
            <h5 className="text-white text-xl md:text-2xl font-bold text-center">
                Kata sandi berhasil diperbarui
            </h5>
            <p className="font-body text-sm md:text-base text-white opacity-50 text-center">
                Kata sandi baru telah berhasil diperbarui. Masuk ke Gradient
                sekarang menggunakan kata sandi yang baru!
            </p>
        </div>
        <div className="flex flex-grow md:flex-grow-0 items-end md:items-start w-full">
            <Button
                variant="custom"
                className="!py-[10px] md:!py-[14px] text-sm md:text-base bg-accent-purple rounded-full text-white md:leading-5 text-center"
                href="/masuk"
                linkClass="w-full">
                Masuk
            </Button>
        </div>
    </section>
);

const KonfirmasiGantiPassword: NextPage = () => {
    const router = useRouter();
    const [validateToken] = usePasswordResetValidateTokenMutation();
    const [confirmIsSuccess, setConfirmIsSuccess] = useState(false);

    useEffect(() => {
        if (router.query.token) {
            validateToken({ token: router.query.token as string })
                .unwrap()
                .catch(() => router.replace('/'));
        }
    }, [router.query]);

    if (!router.query.token) {
        return null;
    }

    return (
        <main className="min-h-screen text-white bg-neutral-1000 flex justify-center">
            <div className="max-w-[325px] mx-[18px] mt-20 mb-12">
                {confirmIsSuccess ? (
                    <Success />
                ) : (
                    <Form setIsSuccess={setConfirmIsSuccess} />
                )}
            </div>
        </main>
    );
};

KonfirmasiGantiPassword.displayName = 'Konfirmasi Ganti Password';
export default withAnon(KonfirmasiGantiPassword);
