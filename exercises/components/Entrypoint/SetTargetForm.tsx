import { FaStar } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { BsTrash3Fill } from 'react-icons/bs';
import Select from 'commons/components/elements/Form/select';
import { Formik, FormikHelpers } from 'formik';
import { Dispatch, SetStateAction, useEffect } from 'react';
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
import { useWindowSize } from 'usehooks-ts';
import { cn } from 'commons/utils';
import { Target } from 'exercises/types/exercises';

interface SetTargetFormProps {
    className?: string;
    targets: StudentTargetInstitution[];
    setTargets: Dispatch<SetStateAction<StudentTargetInstitution[]>>;
    setIsOpen?: Dispatch<SetStateAction<boolean>>;
    sendMessage?: (prompt: string, imageUrl?: string) => Promise<void>;
}

// to check whether the old target has changed
function isTargetsChanged(oldTargets: Target[], newTargets: Target[]) {
    if (oldTargets.length !== newTargets.length) {
        return true;
    }

    const oldTargetsStr = JSON.stringify(oldTargets).replace(/\s/g, '');
    const newTargetsStr = JSON.stringify(newTargets).replace(/\s/g, '');

    return oldTargetsStr !== newTargetsStr;
}

function SetTargetForm({
    className = '',
    targets,
    setTargets,
    setIsOpen,
    sendMessage
}: SetTargetFormProps): JSX.Element {
    const { width } = useWindowSize();
    const [submitTargetInstitutions, { isLoading }] =
        useSetStudentTargetInstitutionsMutation();

    let formikInitialValue = [];
    if (targets.length > 0) {
        formikInitialValue = targets.map((target) => ({
            id: `${target.id}:${target.major.id}`,
            institution: `${target.id}:${target.name}`,
            major: `${target.major.id}:${target.major.name}`
        }));
    } else {
        formikInitialValue.push({ id: uuidv4(), institution: '', major: '' });
    }

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
                        value.major = ''; // Reset major when institution changes
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

        let prompt = '';
        if (sendMessage) {
            // format prompt for each target
            if (values.length > 1) {
                for (let i = 0; i < values.length; i++) {
                    prompt += `Target ${i + 1}:\n`;
                    for (const [k, v] of Object.entries(values[i])) {
                        if (k === 'id') {
                            continue;
                        }
                        prompt += `- ${k}: ${v.split(':')[1]}\n\n`;
                    }
                }
            } else if (values.length === 1) {
                for (const [k, v] of Object.entries(values[0])) {
                    if (k === 'id') {
                        continue;
                    }
                    prompt += `- ${k}: ${v.split(':')[1]}\n`;
                }
            }
        }

        try {
            const [res, _] = await Promise.all([
                submitTargetInstitutions(setStudentTargetInstitutions),
                sendMessage && sendMessage(prompt)
            ]);

            if (!Object.hasOwn(res, 'error')) {
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
                setIsOpen && setIsOpen(false);
            }
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
                <form
                    onSubmit={handleSubmit}
                    autoComplete="off"
                    className={cn(width < 768 ? 'mt-6' : 'mt-8', className)}>
                    <div
                        className={`${
                            width < 768 ? 'gap-8' : 'gap-6'
                        } flex flex-col`}>
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

                                <div
                                    className={
                                        width < 768
                                            ? 'space-y-4'
                                            : 'grid grid-cols-2 gap-4'
                                    }>
                                    <Select
                                        isAsync
                                        isSearchTarget
                                        isClearable={false}
                                        noOptionsMessage="Ketik nama universitas"
                                        onChange={selectOnChange(
                                            id,
                                            'institution',
                                            setValues
                                        )}
                                        initialValue={institution}
                                        option={institutionOptions}
                                        loadOption={loadInstitutionOption(
                                            institution.split(':')[0]
                                            // major.split(':')[0]
                                        )}
                                        name="institution"
                                        placeholder="Pilih Kampus"
                                    />
                                    <Select
                                        key={institution}
                                        isAsync
                                        isSearchTarget
                                        isClearable={false}
                                        noOptionsMessage="Ketik jurusan yang dipilih"
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

                        {values.length < 4 ? (
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
                                    (values.length > 0 &&
                                        values[values.length - 1]
                                            .institution === '') ||
                                    (values.length > 0 &&
                                        values[values.length - 1].major === '')
                                }
                                variant="custom"
                                type="button"
                                className="!bg-transparent flex justify-center items-center gap-2 border border-dashed border-[#4B4E5F] !rounded-lg">
                                <FaPlus className="fill-[#666666] w-5 h-5" />
                                <span className="text-[#666666] text-sm">
                                    Tambah Pilihan
                                </span>
                            </Button>
                        ) : (
                            <></>
                        )}
                    </div>

                    <Button
                        disabled={
                            isLoading ||
                            !isTargetsChanged(formikInitialValue, values) ||
                            (values.length > 0 &&
                                values[values.length - 1].institution === '') ||
                            (values.length > 0 &&
                                values[values.length - 1].major === '')
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
