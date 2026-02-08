import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { CopilotInterrupt } from 'copilot/types/copilot';
import { Formik, FormikValues } from 'formik';
import { toast } from 'react-toastify';

interface InterruptInputProps {
    message: string;
    fields: CopilotInterrupt['data']['fields'];
    isLoadingResponse: boolean;
    sendMessage: (prompt: string, imageUrl?: string) => Promise<void>;
}

function InterruptInput({
    message,
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
                    for (const [key, value] of Object.entries(values)) {
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
                    <h3 className="text-white font-semibold leading-[140%] mb-4">
                        {message}
                    </h3>

                    <div className="space-y-4">
                        {fields?.map((v) => (
                            <Input
                                disabled={isLoadingResponse}
                                key={v.name}
                                type={v.type}
                                name={v.name}
                                value={values[v.name]}
                                placeholder={v.label}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        ))}
                    </div>

                    <Button
                        disabled={!dirty || isLoadingResponse}
                        type="submit"
                        variant="primary"
                        className="!px-6 !py-3 mt-6 block ml-auto">
                        Submit
                    </Button>
                </form>
            )}
        </Formik>
    );
}

export { InterruptInput };
