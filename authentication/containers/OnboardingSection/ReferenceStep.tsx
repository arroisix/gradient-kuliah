import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import { useContext, useEffect } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import { useGetRegisterReferenceQuery } from 'authentication/redux/api/authApi';
import Radio from 'commons/components/elements/Form/radio';
import TextArea from 'commons/components/elements/Form/TextArea';
import { useTracker } from 'tracker/tracker';

export const ReferenceStep = (): JSX.Element => {
    const { formData, updateUser } = useContext(RegistrationContext);
    const { data: registerReferences, isLoading: isLoadingReferences } =
        useGetRegisterReferenceQuery({});

    const tracker = useTracker();

    useEffect(() => {
        tracker?.genericTrack('Visit Onboarding Reference Step');
    }, []);

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
                        localStorage.setItem('isLastOnboardingStep', `true`);

                        await updateUser({ ...formData, ...values });
                        setSubmitting(false);
                    }}
                    validate={(values) => {
                        const errors: { [key: string]: string } = {};

                        if (!values.join_reasoning || values.join_reasoning === '')
                            errors.join_reasoning = 'Alasan bergabung tidak boleh kosong';
    
                        console.log(errors)
                        return errors;
                    }}>
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        isValid: isFormValid,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-4">
                                <Radio
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.register_reference_id}
                                    name="register_reference_id"
                                    label="Dari mana kamu mengetahui Gradient?"
                                    options={registerReferences.data.map(
                                        (ref) => ({
                                            key: ref.id,
                                            value: ref.name
                                        })
                                    )}
                                />
                                <TextArea
                                    label="Apa yang membuatmu tertarik bergabung bersama Gradient?"
                                    name="join_reasoning"
                                    placeholder="Cara Penyampaian yang menarik"
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
                            <div className="fixed left-0 md:left-auto bottom-16 px-[16px] md:px-0 w-full md:w-[400px]">
                                <Button
                                    disabled={(
                                        !values.register_reference_id ||
                                        !values.join_reasoning || values.join_reasoning === ''
                                    ) || !isFormValid || isSubmitting}
                                    variant="custom"
                                    className="w-full mt-4 text-white bg-accent-purple"
                                    type="submit"
                                >
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
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
