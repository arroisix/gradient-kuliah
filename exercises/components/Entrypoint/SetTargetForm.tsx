import { FaPlus } from 'react-icons/fa6';
import { FaStar } from 'react-icons/fa';
import { BsTrash3Fill } from 'react-icons/bs';
import Select from 'commons/components/elements/Form/select';
import { Formik, FormikHelpers } from 'formik';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useOptionLoader } from 'authentication/hooks/useOptionLoader';
import Button from 'commons/components/elements/Button';
import Spinner from 'commons/components/elements/Spinner';
import { v4 as uuidv4 } from 'uuid';
import { useSetStudentTargetInstitutionsMutation } from 'dashboard/redux/api/dashboardApi';
import {
    SetStudentTargetInstitution,
    StudentTargetInstitution
} from 'dashboard/types/dashboard';
import { toast } from 'react-toastify';

interface Target {
    id: string; // to differentiate between targets

    // both types below will have format like this: "major_id:major_name"
    institution: string;
    major: string;
}

interface SetTargetFormProps {
    targets: StudentTargetInstitution[];
    setTargets: Dispatch<SetStateAction<StudentTargetInstitution[]>>;
    setIsDrawerOpened: Dispatch<SetStateAction<boolean>>;
}

function SetTargetForm({
    targets,
    setTargets,
    setIsDrawerOpened
}: SetTargetFormProps): JSX.Element {
    const [submitTargetInstitutions, { isLoading }] =
        useSetStudentTargetInstitutionsMutation();

    const formikInitialValue = useMemo((): Target[] => {
        if (targets.length > 0) {
            return targets.map((target) => ({
                id: uuidv4(),
                institution: `${target.id}:${target.name}`,
                major: `${target.major.id}:${target.major.name}`
            }));
        }

        return [
            {
                id: uuidv4(),
                institution: '',
                major: ''
            }
        ];
    }, [targets]);

    const {
        options: institutionOptions,
        setOptions: setInstitutionOptions,
        loadTargetOptions: loadInstitutionOption
    } = useOptionLoader('institute');

    const {
        options: majorOptions,
        setOptions: setMajorOptions,
        loadTargetOptions: loadMajorOption
    } = useOptionLoader('major');

    const selectOnChange = (
        target_id: string,
        fieldName: string,
        setValues: (
            values: SetStateAction<Target[]>,
            shouldValidate?: boolean
        ) => void
    ) => {
        return (newValue: string | null) => {
            setValues((values) =>
                values.map((value) => {
                    if (value.id !== target_id) {
                        return value;
                    }

                    if (fieldName === 'institution') {
                        value.institution = newValue ?? '';
                    }

                    if (fieldName === 'major') {
                        value.major = newValue ?? '';
                    }

                    return value;
                })
            );
        };
    };

    const submitStudentTargets: (
        values: Target[],
        formikHelpers: FormikHelpers<Target[]>
    ) => void | Promise<any> = async (values, { setSubmitting }) => {
        setSubmitting(true);
        const setStudentTargetInstitutions = values.map(
            (value): SetStudentTargetInstitution => ({
                institution_id: value.institution.split(':')[0],
                major_id: value.major.split(':')[0]
            })
        );

        try {
            await submitTargetInstitutions(setStudentTargetInstitutions);
            toast.success(
                'Target kamu sudah kami simpan! Yuk mulai persiapan UTBK',
                {
                    position: 'top-center',
                    theme: 'colored',
                    hideProgressBar: true
                }
            );
            setTargets(
                values.map((value) => {
                    const [institution_id, institution_name] =
                        value.institution.split(':');
                    const [major_id, major_name] = value.major.split(':');
                    return {
                        id: institution_id,
                        name: institution_name,
                        major: { id: major_id, name: major_name }
                    };
                })
            );
            setIsDrawerOpened(false);
        } catch (error) {
            console.error(
                new Error('failed to submit student target institutions', {
                    cause: error
                })
            );
            toast.error(
                'Terdapat masalah saat menyimpan target kampus, mohon coba lagi',
                {
                    position: 'top-center',
                    theme: 'colored',
                    hideProgressBar: true
                }
            );
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (targets.length > 0) {
            const institutionOptions: Option[] = [];
            const majorOptions: Option[] = [];

            for (const target of targets) {
                institutionOptions.push({
                    value: `${target.id}:${target.name}`,
                    label: target.name
                });

                majorOptions.push({
                    value: `${target.major.id}:${target.major.name}`,
                    label: target.major.name
                });
            }

            setInstitutionOptions(institutionOptions);
            setMajorOptions(majorOptions);
        }
    }, [setInstitutionOptions, setMajorOptions, targets]);

    return (
        <Formik
            initialValues={formikInitialValue}
            onSubmit={submitStudentTargets}>
            {({ values, handleSubmit, setValues }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="flex flex-col gap-6 first:mt-8">
                        {values.map(({ id, institution, major }, index) => (
                            <div key={id} className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex justify-start items-center gap-2">
                                        {index > 0 ? (
                                            <div className="bg-[#666666] text-[#DEDEDE] text-xs font-semibold rounded-full grid place-items-center w-4 h-4">
                                                {index + 1}
                                            </div>
                                        ) : (
                                            <FaStar className="fill-[#B6A6F3] w-4 h-4" />
                                        )}

                                        <span
                                            className={`${
                                                index > 0
                                                    ? 'text-white'
                                                    : 'text-[#B6A6F3]'
                                            } font-semibold text-sm`}>
                                            {index > 0
                                                ? `Pilihan ${index + 1}`
                                                : 'Pilihan Utama'}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setValues(
                                                values.filter(
                                                    (value) => value.id !== id
                                                )
                                            );
                                        }}
                                        className={
                                            values.length > 1
                                                ? 'block'
                                                : 'hidden'
                                        }
                                        type="button">
                                        <BsTrash3Fill className="fill-[#999999] w-4 h-4" />
                                        <span className="sr-only"></span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Select
                                        isAsync
                                        isSearchTarget
                                        onChange={selectOnChange(
                                            id,
                                            'institution',
                                            setValues
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
                                        onChange={selectOnChange(
                                            id,
                                            'major',
                                            setValues
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
                            </div>
                        ))}

                        <Button
                            onClick={() => {
                                setValues([
                                    ...values,
                                    {
                                        id: uuidv4(),
                                        institution: '',
                                        major: ''
                                    }
                                ]);
                            }}
                            disabled={
                                values.length === 3 ||
                                values[values.length - 1].institution === '' ||
                                values[values.length - 1].major === ''
                            }
                            variant="custom"
                            type="button"
                            className="!bg-transparent flex justify-center items-center gap-2 border border-dashed border-[#4B4E5F] !rounded-lg">
                            <FaPlus className="fill-[#666666] w-5 h-5" />
                            <span className="text-[#666666] text-sm">
                                Tambah Pilihan
                            </span>
                        </Button>
                    </div>

                    <Button
                        disabled={
                            isLoading ||
                            values[values.length - 1].institution === '' ||
                            values[values.length - 1].major === ''
                        }
                        variant="primary"
                        className="w-full max-w-[328px] block mx-auto py-2 mt-8"
                        type="submit">
                        {isLoading ? <Spinner size="small" /> : 'Simpan Target'}
                    </Button>
                </form>
            )}
        </Formik>
    );
}

export { SetTargetForm };
