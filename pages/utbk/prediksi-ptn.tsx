import { useOptionLoader } from 'authentication/hooks/useOptionLoader';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import Select from 'commons/components/elements/Form/select';
import { CDN_URL } from 'commons/constants';
import Layout from 'commons/utbkLayout';
import { Formik, FormikHelpers } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { TiArrowRight } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';
import { IoMdArrowRoundDown } from 'react-icons/io';

function TargetKampusIcon({ className }: PropsWithClassName) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={className}>
            <path d="M21.9455 7.21419L12.6694 3.14796C12.2189 2.95068 11.7277 2.95068 11.2771 3.14796L2.02664 7.21419C1.71125 7.35482 1.5 7.72448 1.5 8.14235C1.5 8.56023 1.71125 8.93189 2.02664 9.07011L3.99605 9.93439C3.60591 10.5692 3.33127 11.3069 3.1905 12.1021C2.81414 12.297 2.55 12.755 2.55 13.2854C2.55 13.6853 2.70796 14.0283 2.94178 14.2642L2.12705 20.251C2.07356 20.6424 2.32031 21 2.64483 21H4.55517C4.87959 21 5.12644 20.6432 5.07295 20.2514L4.25822 14.2646C4.49217 14.0287 4.65 13.6511 4.65 13.2854C4.65 12.872 4.48023 12.5208 4.23263 12.2853C4.37214 11.5717 4.65525 10.9264 5.05097 10.3957L11.305 13.1371C11.7555 13.3344 12.2467 13.3344 12.6973 13.1371L21.9734 9.07092C22.29 8.92989 22.5 8.56023 22.5 8.14235C22.5 7.72448 22.29 7.35482 21.9455 7.21419ZM13.0205 14.3462C12.712 14.4948 12.3577 14.5712 12 14.5712C11.6417 14.5712 11.2883 14.4962 10.95 14.348L6.18563 12.2608L5.7 17.9985C5.7 19.658 8.49234 21 12 21C15.4486 21 18.3 19.658 18.3 17.9997L17.815 12.258L13.0205 14.3462Z" />
        </svg>
    );
}

function PencilIcon({ className }: PropsWithClassName) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={className}>
            <path
                d="M5.40576 18.3228L4.40381 18.4976C4.33808 18.5069 4.29184 18.4517 4.30127 18.3979L4.30225 18.396L4.47607 17.3931L5.40576 18.3228ZM16.4165 9.59326L8.77002 17.2407L8.58154 17.0327L7.26904 15.5806L7.24561 15.5542L7.21924 15.5308L5.76514 14.2163L5.55713 14.0288L13.2056 6.38135L16.4165 9.59326ZM16.2319 3.35498C16.5713 3.0156 17.1266 3.01367 17.4712 3.35596L19.4438 5.32861C19.7847 5.66772 19.7867 6.22068 19.4429 6.56494L18.145 7.86182L14.9351 4.65088L16.2319 3.35498Z"
                stroke="#B6A6F3"
                strokeWidth="1.4"
            />
            <line
                x1="2.8999"
                y1="22.3"
                x2="21.0999"
                y2="22.3"
                stroke="#B6A6F3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function GraduateIcon({ className }: PropsWithClassName) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={className}>
            <path d="M21.9455 7.21419L12.6694 3.14796C12.2189 2.95068 11.7277 2.95068 11.2771 3.14796L2.02664 7.21419C1.71125 7.35482 1.5 7.72448 1.5 8.14235C1.5 8.56023 1.71125 8.93189 2.02664 9.07011L3.99605 9.93439C3.60591 10.5692 3.33127 11.3069 3.1905 12.1021C2.81414 12.297 2.55 12.755 2.55 13.2854C2.55 13.6853 2.70796 14.0283 2.94178 14.2642L2.12705 20.251C2.07356 20.6424 2.32031 21 2.64483 21H4.55517C4.87959 21 5.12644 20.6432 5.07295 20.2514L4.25822 14.2646C4.49217 14.0287 4.65 13.6511 4.65 13.2854C4.65 12.872 4.48023 12.5208 4.23263 12.2853C4.37214 11.5717 4.65525 10.9264 5.05097 10.3957L11.305 13.1371C11.7555 13.3344 12.2467 13.3344 12.6973 13.1371L21.9734 9.07092C22.29 8.92989 22.5 8.56023 22.5 8.14235C22.5 7.72448 22.29 7.35482 21.9455 7.21419ZM13.0205 14.3462C12.712 14.4948 12.3577 14.5712 12 14.5712C11.6417 14.5712 11.2883 14.4962 10.95 14.348L6.18563 12.2608L5.7 17.9985C5.7 19.658 8.49234 21 12 21C15.4486 21 18.3 19.658 18.3 17.9997L17.815 12.258L13.0205 14.3462Z" />
        </svg>
    );
}

interface PrediksiPTNForm {
    // both types below will have format like this: "major_id:major_name"
    institution: string;
    major: string;

    score: {
        penalaran_kualitatif: string;
        pemahaman_dan_penalaran_umum: string;
        literasi_bahasa_indonesia: string;
        penalaran_matematis: string;
        pemahaman_bacaan_dan_menulis: string;
        literasi_bahasa_inggris: string;
        penalaran_umum: string;
    };
}

interface MateriCardProps {
    label: string;
    name: string;
    icon: string;
    value: string;
    setFieldValue: (fieldName: string, newValue: any) => void;
}

function MateriCard({
    label,
    name,
    icon,
    value,
    setFieldValue
}: MateriCardProps) {
    return (
        <div
            key={name}
            className="bg-black/40 border border-[#27272A] rounded-2xl p-4 space-y-4 h-full flex flex-col justify-between last-of-type:col-start-2">
            <div className="flex items-center justify-center rounded-full w-10 h-10 bg-[#333333] mx-auto">
                <Image
                    src={`${CDN_URL}/assets/utbk/${icon}`}
                    alt={label}
                    width={24}
                    height={24}
                />
            </div>

            <h3 className="text-sm text-center text-[#DEDEDE]">{label}</h3>

            <Input
                type="text"
                placeholder="Nilai"
                name={name}
                value={value}
                onChange={(event) =>
                    setFieldValue(
                        `score.${name}`,
                        event.currentTarget.value as any
                    )
                }
                className="!py-2 !px-4 !bg-[#222222] border border-[#333333] [&>input]:text-white !h-10"
            />
        </div>
    );
}

function PeluangCard() {
    return (
        <div className="bg-[#191920] rounded-2xl p-6 w-full max-w-[343px] md:max-w-[400px] mx-auto relative overflow-hidden">
            <div className="w-[345px] h-[345px] rounded-full absolute -top-14 -left-14 bg-gradient-to-r from-[#741F86] via-[#965084] to-[#A82C56] opacity-30 blur-2xl"></div>

            <button type="button" className="absolute top-4 right-4">
                <IoClose className="fill-[#999999] w-6 h-6" />
            </button>

            <div className="relative z-10">
                <span className="hidden md:block text-white/30 font-bold text-2xl mb-8">
                    Gradient
                </span>

                <h2 className="text-white font-semibold text-xl md:text-2xl mb-1 md:mb-2">
                    Teknik Sipil
                </h2>

                <p className="text-white text-xs md:text-sm flex items-center gap-1 md:gap-2">
                    <GraduateIcon className="fill-[#B6A6F3] md:fill-white w-4 h-4 md:w-6 md:h-6" />
                    Universitas Indonesia
                </p>

                <div className="bg-[#101010] rounded-lg py-4 px-6 mt-6">
                    <span className="text-[#03AC5C] font-bold text-[32px] md:text-[40px] mb-1">
                        82%
                    </span>
                    <span className="text-white font-semibold block">
                        Peluang tinggi
                    </span>

                    <div className="w-full h-[1px] bg-[#222222] mt-6 mb-4"></div>

                    <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[#DEDEDE] text-sm">
                                Skor kamu
                            </span>
                            <span className="text-white font-semibold text-xl">
                                725
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[#DEDEDE] text-sm">
                                Passing Grade 2024
                            </span>
                            <span className="text-white font-semibold text-xl">
                                688
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    variant="secondary"
                    className="w-full max-w-[215px] mx-auto text-sm font-semibold text-white flex justify-center items-center gap-1.5 mt-6">
                    <IoMdArrowRoundDown className="fill-white w-4 h-4 shrink-0" />{' '}
                    <span className="text-nowrap">Simpan sebagai Gambar</span>
                </Button>
            </div>
        </div>
    );
}

const PrediksiPTNPage = (): JSX.Element => {
    const {
        options: institutionOptions,
        loadTargetOptions: loadInstitutionOption
    } = useOptionLoader('institute');

    const { options: majorOptions, loadTargetOptions: loadMajorOption } =
        useOptionLoader('major');

    const handleOnChange = (
        fieldName: string,
        setFieldValue: (fieldName: string, newValue: any) => void
    ) => {
        return (newValue: string) => {
            setFieldValue(fieldName, newValue);
        };
    };

    const formikInitialValue = useMemo((): PrediksiPTNForm => {
        return {
            institution: '',
            major: '',
            score: {
                literasi_bahasa_indonesia: '',
                literasi_bahasa_inggris: '',
                pemahaman_bacaan_dan_menulis: '',
                pemahaman_dan_penalaran_umum: '',
                penalaran_kualitatif: '',
                penalaran_matematis: '',
                penalaran_umum: ''
            }
        };
    }, []);

    const handleOnSubmit: (
        values: PrediksiPTNForm,
        formikHelpers: FormikHelpers<PrediksiPTNForm>
    ) => void | Promise<any> = async (values, { setSubmitting }) => {
        // TODO: each score is a string, hence it needs to be validated as number
    };

    return (
        <Layout>
            <div className="max-w-screen-lg mx-auto pt-32 px-4">
                <h1 className="text-white font-bold text-2xl mb-2.5 text-center md:text-start">
                    Kalkukator Prediksi PTN
                </h1>

                <p className="text-[#DEDEDE] text-sm mb-6 text-center md:text-start">
                    Masukkan target kampus dan perkiraan nilaimu untuk melihat
                    peluang lolos UTBK. Jika belum pernah try out bisa pakai
                    estimasi dulu.
                </p>

                <Formik
                    initialValues={formikInitialValue}
                    onSubmit={handleOnSubmit}>
                    {({
                        values: { institution, major, score },
                        handleSubmit,
                        setValues,
                        setFieldValue
                    }) => (
                        <form
                            onSubmit={handleSubmit}
                            action=""
                            autoComplete="off"
                            className="space-y-6 md:space-y-0 md:grid md:grid-cols-6 md:gap-8">
                            <div className="col-span-2 bg-[#101010] rounded-2xl p-6 space-y-8 h-fit">
                                <h2 className="font-semibold text-white text-xl flex items-center gap-3">
                                    <TargetKampusIcon className="fill-white w-6 h-6" />
                                    Target Kampus
                                </h2>

                                <div className="space-y-4">
                                    <Select
                                        isAsync
                                        isSearchTarget
                                        isClearable={false}
                                        noOptionsMessage="Ketik nama universitas"
                                        onChange={handleOnChange(
                                            'institution',
                                            setFieldValue
                                        )}
                                        initialValue={institution}
                                        option={institutionOptions}
                                        loadOption={loadInstitutionOption(
                                            institution.split(':')[0],
                                            major.split(':')[0]
                                        )}
                                        name="institution"
                                        placeholder="Pilih Kampus"
                                    />
                                    <Select
                                        isAsync
                                        isSearchTarget
                                        isClearable={false}
                                        noOptionsMessage="Ketik jurusan yang dipilih"
                                        onChange={handleOnChange(
                                            'major',
                                            setFieldValue
                                        )}
                                        initialValue={major}
                                        option={majorOptions}
                                        loadOption={loadMajorOption(
                                            institution.split(':')[0],
                                            major.split(':')[0]
                                        )}
                                        name="major"
                                        placeholder="Pilih Jurusan"
                                    />
                                </div>

                                <Link
                                    href="/utbk/try-out"
                                    className="bg-[#1E1930] border border-[#36236A] flex justify-center items-center gap-6 p-4 rounded-2xl">
                                    <span className="flex items-center gap-3 text-sm text-white">
                                        <PencilIcon className="w-6 h-6 shrink-0" />{' '}
                                        Belum pernah try out? Coba di Gradient
                                    </span>
                                    <TiArrowRight className="fill-white w-4 h-4 shrink-0" />
                                </Link>
                            </div>

                            <div
                                className={`${
                                    institution === '' || major === ''
                                        ? 'opacity-50 pointer-events-none'
                                        : ''
                                } col-span-4 bg-[#101010] rounded-2xl p-6 space-y-8`}>
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <h2 className="text-white font-semibold text-xl">
                                            Input Nilai Subtest
                                        </h2>

                                        <p className="text-[#9CA3AF] text-sm mb-6">
                                            Gunakan nilai try out terakhirmu
                                            atau perkiraan kemampuan saat ini.
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setValues({
                                                institution,
                                                major,
                                                score: {
                                                    literasi_bahasa_indonesia:
                                                        '',
                                                    literasi_bahasa_inggris: '',
                                                    pemahaman_bacaan_dan_menulis:
                                                        '',
                                                    pemahaman_dan_penalaran_umum:
                                                        '',
                                                    penalaran_kualitatif: '',
                                                    penalaran_matematis: '',
                                                    penalaran_umum: ''
                                                }
                                            })
                                        }
                                        variant="tertiary"
                                        className={
                                            score.literasi_bahasa_indonesia !==
                                                '' ||
                                            score.literasi_bahasa_inggris !==
                                                '' ||
                                            score.pemahaman_bacaan_dan_menulis !==
                                                '' ||
                                            score.pemahaman_dan_penalaran_umum !==
                                                '' ||
                                            score.penalaran_kualitatif !== '' ||
                                            score.penalaran_matematis !== '' ||
                                            score.penalaran_umum !== ''
                                                ? ''
                                                : 'pointer-events-none opacity-50'
                                        }>
                                        Reset
                                    </Button>
                                </div>

                                <div className="w-full max-w-[240px] mx-auto space-y-2.5 md:space-y-0 md:max-w-full md:grid md:grid-cols-3 md:gap-4">
                                    <MateriCard
                                        label="Penalaran Kualitatif"
                                        name="penalaran_kualitatif"
                                        icon="penalaran-kualitatif.svg"
                                        value={score.penalaran_kualitatif}
                                        setFieldValue={setFieldValue}
                                    />
                                    <MateriCard
                                        label="Pemahaman dan Penalaran Umum"
                                        name="pemahaman_dan_penalaran_umum"
                                        icon="pemahaman-penalaran-umum.svg"
                                        value={
                                            score.pemahaman_dan_penalaran_umum
                                        }
                                        setFieldValue={setFieldValue}
                                    />
                                    <MateriCard
                                        label="Literasi Bahasa Indonesia"
                                        name="literasi_bahasa_indonesia"
                                        icon="literasi-bahasa-indonesia.svg"
                                        value={score.literasi_bahasa_indonesia}
                                        setFieldValue={setFieldValue}
                                    />
                                    <MateriCard
                                        label="Penalaran Matematis"
                                        name="penalaran_matematis"
                                        icon="penalaran-matematis.svg"
                                        value={score.penalaran_matematis}
                                        setFieldValue={setFieldValue}
                                    />
                                    <MateriCard
                                        label="Pemahaman Bacaan dan Menulis"
                                        name="pemahaman_bacaan_dan_menulis"
                                        icon="pemahaman-bacaan.svg"
                                        value={
                                            score.pemahaman_bacaan_dan_menulis
                                        }
                                        setFieldValue={setFieldValue}
                                    />
                                    <MateriCard
                                        label="Literasi Bahasa Inggris"
                                        name="literasi_bahasa_inggris"
                                        icon="literasi-bahasa-inggris.svg"
                                        value={score.literasi_bahasa_inggris}
                                        setFieldValue={setFieldValue}
                                    />
                                    <MateriCard
                                        label="Penalaran Umum"
                                        name="penalaran_umum"
                                        icon="penalaran-umum.svg"
                                        value={score.penalaran_umum}
                                        setFieldValue={setFieldValue}
                                    />
                                </div>

                                <Button
                                    disabled={
                                        !score.literasi_bahasa_indonesia ||
                                        !score.literasi_bahasa_inggris ||
                                        !score.pemahaman_bacaan_dan_menulis ||
                                        !score.pemahaman_dan_penalaran_umum ||
                                        !score.penalaran_kualitatif ||
                                        !score.penalaran_matematis ||
                                        !score.penalaran_umum
                                    }
                                    variant="primary"
                                    className="w-full max-w-[240px] md:max-w-[328px] block mx-auto py-2 mt-8"
                                    type="submit">
                                    Lihat Peluang
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </Layout>
    );
};

PrediksiPTNPage.displayName = 'Prediksi PTN';
export default PrediksiPTNPage;
