import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { useContext } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import { useCheckUsernameAvailabilityMutation } from 'authentication/redux/api/authApi';

export const IdentityStep = (): JSX.Element => {
    const user = useSelector(getCurrentUser);
    const [checkUsernameAvailability] = useCheckUsernameAvailabilityMutation();

    const { setStep, formData, setFormData } = useContext(RegistrationContext);

    return (
        <div className="flex flex-col w-full">
            <Formik
                initialValues={
                    {
                        full_name: formData.full_name || user.full_name || '',
                        username: formData.username || ''
                    } as UpdateUserInputData
                }
                onSubmit={(values) => {
                    setFormData({
                        ...formData,
                        ...values,
                        photo_profile: ''
                    });
                    setStep(1);
                }}
                validate={async (values) => {
                    const errors: { [key: string]: string } = {};

                    if (!values.full_name) errors.full_name = 'Required';
                    if (!values.username) errors.username = 'Required';

                    if (!!values.username) {
                        const result = await checkUsernameAvailability({
                            username: values.username
                        });

                        const {
                            data: { is_available }
                        } = result as CheckUsernameAvailabilityResponse;

                        if (!is_available)
                            errors.username = 'Username is not available';
                    }

                    return errors;
                }}
                validateOnChange={false}
                validateOnBlur={false}>
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit
                }) => (
                    <form onSubmit={handleSubmit} className="container">
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Nama Lengkap"
                                type="text"
                                placeholder="Nama"
                                name="full_name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.full_name}
                                error={
                                    touched.full_name && errors.full_name
                                        ? errors.full_name
                                        : undefined
                                }
                            />
                            <Input
                                label="Username"
                                type="text"
                                placeholder="Username"
                                name="username"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.username}
                                error={
                                    touched.username && errors.username
                                        ? errors.username
                                        : undefined
                                }
                            />
                        </div>
                        <Button
                            variant="custom"
                            className="w-full mt-4 text-white bg-accent-purple"
                            type="submit">
                            Selanjutnya
                        </Button>
                    </form>
                )}
            </Formik>
        </div>
    );
};
