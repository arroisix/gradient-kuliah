import { useOptionLoader } from 'authentication/hooks/useOptionLoader';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import Select from 'commons/components/elements/Form/select';
import { CDN_URL } from 'commons/constants';
import Layout from 'commons/utbkLayout';
import { Formik, FormikHelpers } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { TiArrowRight } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { GraduateIcon } from 'commons/components/elements/Icons/GraduateIcon';
import { TargetKampusIcon } from 'commons/components/elements/Icons/TargetKampusIcon';
import { PencilIcon } from 'commons/components/elements/Icons/PencilIcon';
import { toast } from 'react-toastify';
import domtoimage from 'dom-to-image';
import { CgInfo } from 'react-icons/cg';

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
                type="number"
                placeholder="Nilai"
                name={name}
                max={1000}
                value={value}
                onChange={(event) =>
                    setFieldValue(
                        `score.${name}`,
                        event.currentTarget.value as any
                    )
                }
                className="hide-input-number-icon !py-2 !px-4 !bg-[#222222] border border-[#333333] [&>input]:text-white !h-10"
            />
        </div>
    );
}

function PeluangCard() {
    const [isLoading, setIsLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const downloadAsImage = async () => {
        if (ref.current) {
            setIsLoading(true);
            try {
                const dataURL = await domtoimage.toPng(ref.current, {
                    filter: (node) => {
                        if (node instanceof HTMLButtonElement) {
                            return false;
                        }
                        return true;
                    }
                });
                const link = document.createElement('a');
                link.setAttribute('href', dataURL);
                link.setAttribute('download', 'peluang_utbk.jpg');
                link.click();
                URL.revokeObjectURL(dataURL);
            } catch (error) {
                toast.error(
                    'Ups, ada masalah saat mengunduh menjadi gambar. Mohon coba lagi'
                );
                console.error(
                    new Error('failed to download peluang card to JPG', {
                        cause: error
                    })
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div ref={ref} className="w-full">
            <div className="modal-box bg-[#191920] rounded-2xl p-6 w-full max-w-[343px] md:max-w-[400px] mx-auto relative overflow-hidden">
                {/* high score: gradient_high_score.png */}
                {/* medium score: gradient_medium_score.png */}
                {/* low score: gradient_low_score.png */}
                <img
                    src={`${CDN_URL}/assets/gradient_high_score.png`}
                    alt=""
                    className="absolute inset-0"
                />

                <form method="dialog" className="absolute top-0 right-0">
                    <button disabled={isLoading}>
                        <IoClose className="fill-[#999999] w-6 h-6 absolute top-4 right-4" />
                    </button>
                </form>

                <div className="relative z-10">
                    <span className="block text-white font-[Urbanist] font-bold text-2xl mb-8">
                        Gradient
                    </span>

                    <h2 className="text-white font-semibold text-xl md:text-2xl mb-1 md:mb-2">
                        Teknik Sipil
                    </h2>

                    <p className="text-white text-sm flex items-center gap-1 md:gap-2">
                        <GraduateIcon className="fill-white w-5 h-5 md:w-6 md:h-6" />
                        Universitas Indonesia
                    </p>

                    <div className="bg-[#101010] rounded-2xl py-4 px-6 mt-6">
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

                    <div className="flex gap-2 mt-3">
                        <CgInfo className="fill-[#999999] w-4 h-4 shrink-0" />
                        <p className="text-[#999999] text-[10px]">
                            Bobot penilaian berbeda di tiap jurusan di
                            masing-masing universitas. Hasil diatas merupakan
                            estimasi berdasarkan data passing grade dari
                            internal.
                        </p>
                    </div>

                    <Button
                        onClick={downloadAsImage}
                        disabled={isLoading}
                        variant="secondary"
                        className={`${
                            isLoading ? '!hidden' : ''
                        } w-full max-w-[215px] mx-auto text-sm font-semibold text-white flex justify-center items-center gap-1.5 mt-6 !py-2 !px-4`}>
                        <IoMdArrowRoundDown className="fill-white w-4 h-4 shrink-0" />{' '}
                        <span className="whitespace-nowrap">
                            Simpan sebagai Gambar
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

const PrediksiPTNPage = (): JSX.Element => {
    const peluangCardModalRef = useRef<HTMLDialogElement | null>(null);

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
        peluangCardModalRef.current?.showModal();

        // TODO: each score is a string, hence it needs to be validated as number
        console.log(values, setSubmitting);
    };

    return (
        <Layout>
            <div className="max-w-screen-lg mx-auto pt-32 px-4">
                <h1 className="text-white font-bold text-2xl mb-2.5 text-center md:text-start">
                    Kalkukator Prediksi PTN
                </h1>

                <p className="text-[#DEDEDE] text-sm mb-6 text-center md:text-start">
                    Bantu memahami peluang masuk PTN berdasarkan skor dan
                    pilihan kampusmu.
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

                                <div className="bg-[#252246] flex items-center gap-3 p-3 rounded-lg">
                                    <CgInfo className="fill-[#B6A6F3] w-5 h-5 shrink-0" />
                                    <p className="text-white text-xs leading-[160%]">
                                        Estimasi hasil prediksi bersifat
                                        referensi dan tidak mencerminkan bobot
                                        subtes resmi tiap universitas. Gunakan
                                        sebagai referensi.
                                    </p>
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

                <dialog
                    ref={peluangCardModalRef}
                    id="peluang_card_modal"
                    className="modal">
                    <PeluangCard />
                </dialog>
            </div>
        </Layout>
    );
};

PrediksiPTNPage.displayName = 'Prediksi PTN';
export default PrediksiPTNPage;
