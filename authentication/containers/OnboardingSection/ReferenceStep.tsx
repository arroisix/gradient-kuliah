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
