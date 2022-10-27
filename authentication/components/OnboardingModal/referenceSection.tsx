import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import Radio from 'commons/components/elements/Form/radio';
import { useGetRegisterReferenceQuery } from 'authentication/redux/api/authApi';
import { useContext } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';

const ReferenceSection = (): JSX.Element => {
    const { data: registerReferences, isLoading: isLoadingReferences } =
        useGetRegisterReferenceQuery({});
    const { setStep, formData, setFormData, updateUser } =
        useContext(RegistrationContext);

    console.log(isLoadingReferences, registerReferences);

    return (
        <div className="w-full flex flex-col">
            <Formik
                initialValues={{} as UpdateUserInputData}
                onSubmit={async (values) => {
                    setFormData({ ...formData, ...values });
                    updateUser(formData);
                }}>
                {({
                    values,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting
                }) => (
                    <form onSubmit={handleSubmit} className="container">
                        {!isLoadingReferences && registerReferences ? (
                            <Radio
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.register_reference_id}
                                name="register_reference_id"
                                label="DARI MANA KAMU MENGETAHUI GRADIENT?"
                                options={registerReferences.data.map((ref) => ({
                                    key: ref.id,
                                    value: ref.name
                                }))}
                            />
                        ) : null}
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
                                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default ReferenceSection;
