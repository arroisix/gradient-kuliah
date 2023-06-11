import { useCheckUsernameAvailabilityMutation } from 'authentication/redux/api/authApi';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import Spinner from 'commons/components/elements/Spinner';
import { useDebouncedCallback } from 'use-debounce';
import { Formik } from 'formik';
import {
    ReduxHTTPError,
    useProfileContext
} from 'profile/contexts/ProfileProvider';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

export const GeneralProfileForm = (): JSX.Element => {
    const { isLoading, updateUser, profile } = useProfileContext();
    const [checkUsernameAvailability, { isLoading: isCheckUsernameLoading }] =
        useCheckUsernameAvailabilityMutation();
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        console.log(isValid);
    }, [isValid]);

    const debounced = useDebouncedCallback(async (value) => {
        const result = await checkUsernameAvailability({
            username: value
        });

        const {
            data: { is_available }
        } = result as CheckUsernameAvailabilityResponse;
        setIsValid(is_available);
    }, 1000);

    const Icon = isValid
        ? FaCheckCircle
        : isCheckUsernameLoading
        ? FaSpinner
        : FaTimesCircle;

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

                if (!values.full_name)
                    errors.full_name = 'Nama lengkap dibutuhkan';
                if (!values.username) errors.username = 'Username dibutuhkan';

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
                            endAddorment={
                                initialValues !== values ? (
                                    <Icon
                                        className={` ${
                                            isValid
                                                ? 'text-green-600'
                                                : isLoading
                                                ? 'animate-spin text-[#999999]'
                                                : 'text-red-600'
                                        }`}
                                    />
                                ) : undefined
                            }
                            className={
                                initialValues === values
                                    ? ''
                                    : isValid
                                    ? 'border-green-600'
                                    : 'border-red-600'
                            }
                            onChange={async (event) => {
                                handleChange(event);
                                setIsValid(false);
                                if (event.target.value !== '') {
                                    await debounced(event.target.value);
                                }
                            }}
                            onBlur={handleBlur}
                            value={values.username}
                            error={
                                touched.username && errors.username
                                    ? errors.username
                                    : !isValid
                                    ? 'Username tidak tersedia'
                                    : undefined
                            }
                        />
                    </div>
                    <Button
                        disabled={
                            isLoading ||
                            initialValues === values ||
                            isCheckUsernameLoading ||
                            !isValid
                        }
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
