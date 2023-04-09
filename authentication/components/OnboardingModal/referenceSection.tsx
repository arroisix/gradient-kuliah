import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import Radio from 'commons/components/elements/Form/radio';
import { useGetRegisterReferenceQuery } from 'authentication/redux/api/authApi';
import { useContext } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import TextArea from 'commons/components/elements/Form/TextArea';

const ReferenceSection = (): JSX.Element => {
    const { data: registerReferences, isLoading: isLoadingReferences } =
        useGetRegisterReferenceQuery({});
    const { setStep, formData, updateUser } = useContext(RegistrationContext);

    return (
        <div className="w-full flex flex-col">
            {!isLoadingReferences && registerReferences ? (
                <Formik
                    initialValues={
                        {
                            register_reference_id:
                                registerReferences?.data[0]?.id,
                            join_reasoning: formData.join_reasoning || ''
                        } as UpdateUserInputData
                    }
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true);
                        await updateUser({ ...formData, ...values });
                        setSubmitting(false);
                    }}>
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => {
                        return (
                            <form onSubmit={handleSubmit} className="container">
                                <Radio
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.register_reference_id}
                                    name="register_reference_id"
                                    label="DARI MANA KAMU MENGETAHUI GRADIENT?"
                                    options={registerReferences.data.map(
                                        (ref) => ({
                                            key: ref.id,
                                            value: ref.name
                                        })
                                    )}
                                />
                                <TextArea
                                    label="APA YANG MEMBUAT KAMU TERTARIK DENGAN GRADIENT? (Optional)"
                                    name="join_reasoning"
                                    placeholder="Saya membutuhkan materi tambahan untuk kuliah"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.join_reasoning}
                                    error={
                                        touched.join_reasoning &&
                                        errors.join_reasoning
                                            ? errors.join_reasoning
                                            : undefined
                                    }
                                    required={true}
                                />
                                <div className="flex space-x-2">
                                    <Button
                                        variant="custom"
                                        className="bg-neutral-100 text-neutral-700 mt-4 w-full"
                                        type="button"
                                        onClick={() => {
                                            setStep(0);
                                        }}>
                                        Kembali
                                    </Button>
                                    <Button
                                        variant="custom"
                                        className="bg-accent-purple text-white mt-4 w-full"
                                        type="submit"
                                        disabled={isSubmitting}>
                                        {isSubmitting
                                            ? 'Menyimpan...'
                                            : 'Simpan'}
                                    </Button>
                                </div>
                            </form>
                        );
                    }}
                </Formik>
            ) : null}
        </div>
    );
};

export default ReferenceSection;
