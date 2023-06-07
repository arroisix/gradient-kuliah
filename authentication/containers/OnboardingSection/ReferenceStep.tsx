import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import { useContext } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import { useGetRegisterReferenceQuery } from 'authentication/redux/api/authApi';
import Radio from 'commons/components/elements/Form/radio';
import TextArea from 'commons/components/elements/Form/TextArea';

export const ReferenceStep = (): JSX.Element => {
    const { formData, updateUser } = useContext(RegistrationContext);
    const { data: registerReferences, isLoading: isLoadingReferences } =
        useGetRegisterReferenceQuery({});

    return (
        <div className="flex flex-col w-full">
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
                    }) => (
                        <form onSubmit={handleSubmit} className="container">
                            <div className="flex flex-col gap-4">
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
                            </div>
                            <Button
                                variant="custom"
                                className="w-full mt-4 text-white bg-accent-purple"
                                type="submit"
                                disabled={isSubmitting}>
                                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </form>
                    )}
                </Formik>
            ) : (
                <span className="font-extrabold text-[#666666] animate-pulse">
                    Loading...
                </span>
            )}
        </div>
    );
};
