import {
    useGetProfileQuery,
    useUpdateUserMutation
} from 'authentication/redux/api/authApi';
import Button from 'commons/components/elements/Button';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import Modal from 'commons/components/modules/Modal';
import { CDN_URL } from 'commons/constants';
import { useThemeContext } from 'commons/contexts/ThemeProvider';
import { cn, sanitizeUrl } from 'commons/utils';
import withAuth from 'commons/withAuth';
import { Field, Form, Formik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { useLocalStorage } from 'usehooks-ts';

const OnboardingOption = ({
    value,
    label,
    imageURL,
    description,
    selected
}: {
    value: string;
    label: string;
    imageURL: string;
    description: string;
    selected: boolean;
}) => {
    return (
        <label>
            <Field
                type="radio"
                name="current_role"
                value={value}
                className="hidden"
            />
            <div
                className={cn(
                    'flex gap-4 items-center border-2 border-solid rounded-lg px-[14px] py-[18px] cursor-pointer',
                    selected
                        ? 'bg-purple-7 border-[#B6A6F3]'
                        : 'bg-violet-2 border-transparent hover:bg-neutral-700'
                )}>
                <img
                    src={imageURL}
                    alt="Download Folder"
                    width={48}
                    height={48}
                    className="!shrink-0"
                />
                <div className="flex flex-col gap-2 text-sm">
                    <span className="text-white font-semibold">{label}</span>
                    <span className={cn(selected && 'text-white')}>
                        {description}
                    </span>
                </div>
            </div>
        </label>
    );
};

const OnboardingOptionDetail = ({
    label,
    imageURL,
    description,
    details
}: {
    label: string;
    imageURL: string;
    description: string;
    details: string[];
}) => {
    return (
        <article className="flex flex-col gap-4 rounded-lg p-4 bg-violet-1">
            <div className="flex gap-4 items-center">
                <img
                    src={imageURL}
                    alt="Download Folder"
                    width={48}
                    height={48}
                    className="!shrink-0"
                />
                <div className="flex flex-col gap-2 text-sm">
                    <span className="text-white font-semibold">{label}</span>
                    <span>{description}</span>
                </div>
            </div>
            <hr className="border-[#282B3C] m-0" />
            <section className="text-xs flex flex-col gap-2">
                <p className="font-semibold">Cocok untuk :</p>
                <ul className="text-graphite-400 text-sm">
                    {details.map((detail) => (
                        <li key={detail}>
                            <p>{detail}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </article>
    );
};

const jenisAkunOptions = [
    {
        value: 'COLLEGE_STUDENT',
        label: 'Memperdalam Materi Kuliah',
        description: 'Video, kuis, dan bank soal buat ningkatin pemahamanmu.',
        imageURL: `${CDN_URL}/assets/college_student.svg`,
        details: [
            'Mahasiswa aktif ataupun calon mahasiswa baru',
            'Butuh bantuan di mata kuliah yang sedang kamu ambil',
            'Ingin mengejar IPK tinggi',
            'Long life learner yang mau eksplor ilmu baru',
            'Untuk yang sudah lulus kuliah tapi mau belajar lagi'
        ] as string[]
    },
    {
        value: 'K12',
        label: 'Persiapan UTBK',
        description: 'Tryout dan pembahasan khusus buat persiapan UTBK.',
        imageURL: `${CDN_URL}/assets/k12.svg`,
        details: [
            'Siswa SMA kelas 12 atau Gap Year',
            'Sedang berjuang masuk PTN impian',
            'Persiapan SNBT atau Ujian Mandiri'
        ] as string[]
    }
] as const;

const OnboardingJenisAkun: NextPage = () => {
    const { theme } = useThemeContext();
    const { data, isLoading } = useGetProfileQuery({});
    const [updateUser] = useUpdateUserMutation();

    const [openDetailsModal, setOpenDetailsModal] = useState(false);

    const router = useRouter();
    function handleRedirect(): void {
        const packetId = localStorage.getItem('packetId');
        if (packetId) {
            router.push(`/pembayaran?packetId=${packetId}`);
        } else if (router.query.redirect) {
            router.push(sanitizeUrl(router.query.redirect as string));
        } else {
            router.push('/');
        }
    }

    const [_, setShowAccountTypePrompt] = useLocalStorage(
        'showAccountTypePrompt',
        false
    );

    useEffect(() => {
        setShowAccountTypePrompt(true);
    }, [setShowAccountTypePrompt]);

    if (isLoading) {
        return <LoadingBackdrop />;
    }

    return (
        <main className="flex h-screen justify-center bg-black text-graphite-400">
            <div className="flex flex-col gap-6 px-4 max-w-[584px] w-full mx-auto justify-center">
                <header className="text-center">
                    <h2 className="text-sm mb-1">
                        Halo, <b>{data?.full_name}!</b>
                    </h2>
                    <h1 className="text-white font-bold">
                        Apa tujuanmu belajar di Gradient?
                    </h1>
                </header>

                <Formik
                    initialValues={{
                        current_role: undefined as string | undefined
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        if (!data) return;
                        setSubmitting(true);
                        await updateUser({
                            ...data,
                            phone_number: data.phone_number.replace(/\+/g, ''),
                            current_role: values.current_role as
                                | 'COLLEGE_STUDENT'
                                | 'K12'
                        });
                        setSubmitting(false);
                        setShowAccountTypePrompt(false);
                        handleRedirect();
                    }}
                    validate={(values) => {
                        const errors: { [key: string]: string } = {};
                        if (!values.current_role)
                            errors.current_role = 'Required';
                        return errors;
                    }}
                    validateOnMount={true}>
                    {({ isValid, isSubmitting, values }) => (
                        <Form className="flex flex-col gap-4">
                            <fieldset className="flex flex-col gap-4">
                                {jenisAkunOptions.map((option) => (
                                    <OnboardingOption
                                        key={option.value}
                                        description={option.description}
                                        imageURL={option.imageURL}
                                        label={option.label}
                                        value={option.value}
                                        selected={
                                            values.current_role === option.value
                                        }
                                    />
                                ))}
                            </fieldset>

                            <p className="text-center text-xs">
                                Kamu nanti bisa ganti pilihan di menu profile
                                kok.
                            </p>

                            <Button
                                disabled={isSubmitting || !isValid}
                                type="submit"
                                variant="primary"
                                className="w-full max-w-[361px] self-center mb-8 !font-semibold h-[46px]">
                                Kunjungi Dashboard
                            </Button>
                        </Form>
                    )}
                </Formik>

                <Button
                    variant="tertiary"
                    className="w-max self-center !text-sm"
                    onClick={() => setOpenDetailsModal(true)}>
                    Apa bedanya?
                </Button>
            </div>

            <Modal
                isOpen={openDetailsModal}
                setOpen={setOpenDetailsModal}
                variant={theme}
                className="!p-4 md:!max-w-[536px]">
                <div className="-mt-6 gap-4 flex flex-col">
                    <h3 className="font-semibold">Pilih Track Belajar</h3>
                    <aside className="flex gap-3 items-center bg-[#252246] p-3 rounded-lg">
                        <MdInfoOutline
                            size={20}
                            color="#B6A6F3"
                            className="shrink-0"
                        />
                        <p className="text-xs leading-5">
                            Pilihan track akan memengaruhi fitur dan rekomendasi
                            konten yang muncul. Kamu juga bisa ubah lagi nanti
                            di menu Profil.
                        </p>
                    </aside>

                    {jenisAkunOptions.map((option) => (
                        <OnboardingOptionDetail
                            key={option.value}
                            description={option.description}
                            imageURL={option.imageURL}
                            label={option.label}
                            details={option.details}
                        />
                    ))}
                </div>
            </Modal>
        </main>
    );
};

OnboardingJenisAkun.displayName = 'Onboarding Jenis Akun';
export default withAuth(OnboardingJenisAkun);
