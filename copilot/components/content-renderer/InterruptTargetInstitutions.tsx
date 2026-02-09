import { useOptionLoader } from 'authentication/hooks/useOptionLoader';
import Button from 'commons/components/elements/Button';
import Select from 'commons/components/elements/Form/select';
import { useSetTargetDrawerContext } from 'exercises/components/Entrypoint/SetTargetDrawer';
import { SetTargetForm } from 'exercises/components/Entrypoint/SetTargetForm';
import { Target } from 'exercises/types/exercises';
import { Formik } from 'formik';
import { SetStateAction } from 'react';
import { toast } from 'react-toastify';

interface InterruptTargetInstitutionsProps {
    isLoadingResponse: boolean;
    sendMessage: (prompt: string, imageUrl?: string) => Promise<void>;
}

function InterruptTargetInstitutions({
    isLoadingResponse,
    sendMessage
}: InterruptTargetInstitutionsProps): JSX.Element {
    const { targets, setTargets } = useSetTargetDrawerContext();
    const initialValues = { institution: '', major: '' };

    const selectOnChange = (
        fieldName: string,
        setValues: (
            value: SetStateAction<Pick<Target, 'institution' | 'major'>>,
            shouldValidate?: boolean
        ) => void
    ) => {
        return (newValue: string | null) => {
            setValues((value) => {
                if (fieldName === 'institution') {
                    value.institution = newValue ?? '';
                    value.major = ''; // Reset major when institution changes
                }

                if (fieldName === 'major') {
                    value.major = newValue ?? '';
                }

                return { ...value };
            });
        };
    };

    const {
        options: institutionOptions,
        loadTargetOptions: loadInstitutionOption
    } = useOptionLoader('institute');

    const { options: majorOptions, loadTargetOptions: loadMajorOption } =
        useOptionLoader('major');

    if (targets.length === 0) {
        return (
            <div className="bg-[#191920] p-6 rounded-2xl w-full max-w-[520px]">
                <SetTargetForm
                    className="mt-0"
                    targets={targets}
                    setTargets={setTargets}
                    sendMessage={sendMessage}
                />
            </div>
        );
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting, setValues }) => {
                let prompt = '';
                const entries = Object.entries(values);
                if (entries.length > 1) {
                    for (const [key, value] of Object.entries(values)) {
                        prompt += `- ${key}: ${value.split(':')[1]}\n`;
                    }
                } else if (entries.length === 1) {
                    prompt = entries[0][1];
                }

                try {
                    setValues({ institution: '', major: '' });
                    await sendMessage(prompt);
                } catch (error) {
                    console.error(
                        new Error('failed to send message', { cause: error })
                    );
                    toast.error(
                        'Terjadi kesalahan saat submit respon kamu, mohon coba lagi',
                        {
                            position: 'top-center',
                            theme: 'colored',
                            hideProgressBar: true
                        }
                    );
                } finally {
                    setSubmitting(false);
                }
            }}>
            {({
                values: { institution, major },
                dirty,
                setValues,
                handleSubmit
            }) => (
                <form
                    onSubmit={handleSubmit}
                    action=""
                    autoComplete="off"
                    className="bg-[#191920] p-6 rounded-2xl w-full max-w-[520px]">
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            key={institution}
                            isAsync
                            isSearchTarget
                            isClearable={false}
                            noOptionsMessage="Ketik nama universitas"
                            onChange={selectOnChange('institution', setValues)}
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
                            key={`${institution}:${major}`}
                            isAsync
                            isSearchTarget
                            isClearable={false}
                            noOptionsMessage="Ketik jurusan yang dipilih"
                            onChange={selectOnChange('major', setValues)}
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

                    <Button
                        disabled={!dirty || isLoadingResponse}
                        variant="primary"
                        className="w-full max-w-[328px] block mx-auto py-2 mt-8"
                        type="submit">
                        Simpan Target
                    </Button>
                </form>
            )}
        </Formik>
    );
}

export { InterruptTargetInstitutions };
