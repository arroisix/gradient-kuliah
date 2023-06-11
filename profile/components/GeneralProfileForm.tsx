import { useCheckUsernameAvailabilityMutation } from 'authentication/redux/api/authApi';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import Spinner from 'commons/components/elements/Spinner';
import { Formik } from 'formik';
import {
    ReduxHTTPError,
    useProfileContext
} from 'profile/contexts/ProfileProvider';
import { toast } from 'react-toastify';

export const GeneralProfileForm = (): JSX.Element => {
    const { isLoading, updateUser, profile } = useProfileContext();
    const [checkUsernameAvailability] = useCheckUsernameAvailabilityMutation();

    return (
        <Formik
            initialValues={
                {
                    full_name: profile?.full_name || '',
                    username: profile?.username || ''
                } as UpdateUserResponseData
            }
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const payload = {
                    ...profile,
                    ...values
                };

                const result = await updateUser(payload);

                if (!(result as ReduxHTTPError).error) {
                    toast.success(`Perubahan berhasil disimpan`, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }

                setSubmitting(false);
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
                initialValues,
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
                        disabled={isLoading || initialValues === values}
                        variant="custom"
                        className="w-full mt-4 text-white bg-accent-purple"
                        type="submit">
                        {isLoading ? <Spinner size="small" /> : 'Simpan'}
                    </Button>
                </form>
            )}
        </Formik>
    );
};
