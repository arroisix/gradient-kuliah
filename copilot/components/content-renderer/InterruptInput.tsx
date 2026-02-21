import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { cn } from 'commons/utils';
import { CopilotInterrupt } from 'copilot/types/copilot';
import { Formik, FormikValues } from 'formik';
import { toast } from 'react-toastify';

interface InterruptInputProps {
    fields: CopilotInterrupt['data']['fields'];
    isLoadingResponse: boolean;
    sendMessage: (prompt: string, imageUrl?: string) => Promise<void>;
}

function InterruptInput({
    fields,
    isLoadingResponse,
    sendMessage
}: InterruptInputProps): JSX.Element {
    const initialValues =
        fields?.reduce((acc: FormikValues, field) => {
            acc[field.name] = '';
            return acc;
        }, {}) ?? {};

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                let prompt = '';
                const entries = Object.entries(values);
                if (entries.length > 1) {
                    for (const [key, value] of entries) {
                        prompt += `- ${key}: ${value}\n`;
                    }
                } else if (entries.length === 1) {
                    prompt = entries[0][1];
                }

                try {
                    resetForm();
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
            {({ values, dirty, handleChange, handleBlur, handleSubmit }) => (
                <form
                    onSubmit={handleSubmit}
                    action=""
                    autoComplete="off"
                    className="bg-[#191920] p-6 rounded-2xl w-full max-w-[400px]">
                    <div className="space-y-4">
                        {fields?.map((v) => (
                            <div key={v.name} className="space-y-2">
                                <label
                                    htmlFor={v.name}
                                    className="text-white font-semibold leading-[140%] mb-4">
                                    {v.label}
                                </label>

                                <Input
                                    disabled={isLoadingResponse}
                                    type={v.type}
                                    name={v.name}
                                    value={values[v.name]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
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

export { InterruptInput };
