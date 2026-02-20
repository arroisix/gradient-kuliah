import Button from 'commons/components/elements/Button';
import { cn } from 'commons/utils';
import { CopilotInterrupt } from 'copilot/types/copilot';
import { Formik, FormikValues } from 'formik';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface InterruptOptionsProps {
    fields?: CopilotInterrupt['data']['fields'];
    options?: string[];
    isLoadingResponse: boolean;
    sendMessage: (prompt: string, imageUrl?: string) => Promise<void>;
}

function InterruptOptions({
    fields,
    options,
    isLoadingResponse,
    sendMessage
}: InterruptOptionsProps): JSX.Element {
    const [selectedOption, setSelectedOption] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFieldsAreString = useMemo(() => {
        if (!Array.isArray(fields)) {
            return false;
        }

        let isAllString = true;
        for (const v of fields) {
            if (typeof v === 'string') {
                continue;
            }
            isAllString = false;
            break;
        }
        return isAllString;
    }, [fields]);

    const usedOptions = useMemo(() => {
        if (Array.isArray(options)) {
            return options;
        }

        if (Array.isArray(fields) && isFieldsAreString) {
            return fields as unknown as string[];
        }

        return [];
    }, [fields, isFieldsAreString, options]);

    const submitOption = async () => {
        setIsSubmitting(true);
        try {
            await sendMessage(selectedOption);
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
            setIsSubmitting(false);
        }
    };

    if (usedOptions.length === 0) {
        return <></>;
    }

    if (isFieldsAreString) {
        return (
            <div className="bg-[#191920] p-6 rounded-2xl w-full max-w-[680px]">
                <div className={cn('grid gap-3', 'lg:grid-cols-2')}>
                    {usedOptions.map((v) => (
                        <button
                            disabled={isLoadingResponse}
                            key={v}
                            onClick={() => setSelectedOption(v)}
                            type="button"
                            className={cn(
                                'text-white p-3 rounded-lg border border-[#7D89CC] text-center disabled:opacity-75 transition-colors text-sm',
                                selectedOption === v
                                    ? 'bg-[#7D89CC]'
                                    : 'bg-[#191920]'
                            )}>
                            {v}
                        </button>
                    ))}
                </div>

                <Button
                    onClick={submitOption}
                    disabled={
                        isLoadingResponse || !selectedOption || isSubmitting
                    }
                    type="button"
                    variant="primary"
                    className={cn(
                        '!px-5 !py-2 mt-6 block w-full',
                        'lg:min-w-fit lg:w-48 lg:ml-auto'
                    )}>
                    Submit
                </Button>
            </div>
        );
    }

    const initialValues =
        fields?.reduce((acc: FormikValues, field) => {
            acc[field.name] = '';
            return acc;
        }, {}) ?? {};

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                let name = '';
                if (Array.isArray(fields) && fields.length > 0) {
                    name = fields[0].name;
                }

                const prompt = values[name];
                try {
                    resetForm();
                    await sendMessage(prompt ?? '');
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
            {({ values, dirty, handleChange, handleSubmit, setFieldValue }) => (
                <form
                    onSubmit={handleSubmit}
                    action=""
                    autoComplete="off"
                    className="bg-[#191920] p-6 rounded-2xl w-full max-w-[680px]">
                    <div className={cn('grid gap-3', 'lg:grid-cols-2')}>
                        {fields?.map((field) => (
                            <button
                                disabled={isLoadingResponse}
                                key={field.label}
                                onClick={() =>
                                    setFieldValue(field.name, field.label)
                                }
                                type="button"
                                className={cn(
                                    'text-white p-3 rounded-lg border border-[#7D89CC] text-center disabled:opacity-75 transition-colors text-sm',
                                    values[field.name] === field.label
                                        ? 'bg-[#7D89CC]'
                                        : 'bg-[#191920]'
                                )}>
                                {field.label}
                                <input
                                    type="radio"
                                    className="hidden"
                                    name={field.name}
                                    value={field.label}
                                    checked={values[field.name] === field.label}
                                    onChange={handleChange}
                                />
                            </button>
                        ))}
                    </div>

                    <Button
                        disabled={!dirty || isLoadingResponse}
                        type="submit"
                        variant="primary"
                        className={cn(
                            '!px-5 !py-2 mt-6 block w-full',
                            'lg:min-w-fit lg:w-48 lg:ml-auto'
                        )}>
                        Submit
                    </Button>
                </form>
            )}
        </Formik>
    );
}

export { InterruptOptions };
