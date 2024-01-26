import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { useContext, useEffect, useState } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import { useCheckUsernameAvailabilityMutation } from 'authentication/redux/api/authApi';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { useDebouncedCallback } from 'use-debounce';
import { useTracker } from 'tracker/tracker';
import { EDUCATION_OPTIONS } from 'authentication/constants';

export const IdentityStep = (): JSX.Element => {
    const [isTyping, setIsTyping] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const user = useSelector(getCurrentUser);
    const [checkUsernameAvailability, { isLoading: isCheckUsernameLoading }] =
        useCheckUsernameAvailabilityMutation();
    const { setStep, formData, setFormData } = useContext(RegistrationContext);

    const tracker = useTracker();
    useEffect(() => {
        tracker?.genericTrack('Visit Onboarding Identity Step');
    }, []);

    const debounced = useDebouncedCallback(
        async (
            value: string,
            setError: (field: string, message: string | undefined) => void
        ) => {
            const result = await checkUsernameAvailability({
                username: value
            });

            const {
                data: { is_available }
            } = result as CheckUsernameAvailabilityResponse;

            setIsValid(is_available);

            setIsTyping(false);

            if (!is_available) {
                setError('username', 'Username tidak tersedia');
            }
        },
        1000
    );

    const Icon = isValid
        ? FaCheckCircle
        : isCheckUsernameLoading || isTyping
        ? FaSpinner
        : FaTimesCircle;

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

                    if (!values.full_name)
                        errors.full_name = 'Nama lengkap dibutuhkan';
                    if (!values.username)
                        errors.username = 'Username dibutuhkan';

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
                    handleSubmit,
                    setFieldError,
                    initialValues,
                    isValid: isFormValid
                }) => (
                    <form onSubmit={handleSubmit}>
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
                                    values.username !== '' &&
                                    initialValues.username !==
                                        values.username ? (
                                        <Icon
                                            className={` ${
                                                isCheckUsernameLoading ||
                                                isTyping
                                                    ? 'animate-spin text-[#999999]'
                                                    : isValid
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }`}
                                        />
                                    ) : undefined
                                }
                                onChange={async (event) => {
                                    handleChange(event);

                                    if (
                                        event.target.value !== '' &&
                                        event.target.value !==
                                            initialValues.username
                                    ) {
                                        setIsValid(false);
                                        setIsTyping(true);
                                        let message = undefined;
                                        setFieldError('username', message);

                                        if (event.target.value.length < 5) {
                                            message =
                                                'Username terdiri dari minimal 5 karakter alphanumeric';
                                        } else if (
                                            event.target.value.length > 16
                                        ) {
                                            message =
                                                'Username terdiri dari maksimal 16 karakter alphanumeric';
                                        } else if (
                                            event.target.value.includes(' ')
                                        ) {
                                            message =
                                                'Username tidak boleh mengandung spasi';
                                        }

                                        if (!!message) {
                                            setFieldError('username', message);
                                            setIsTyping(false);
                                        } else {
                                            await debounced(
                                                event.target.value,
                                                setFieldError
                                            );
                                        }
                                    }
                                }}
                                onBlur={handleBlur}
                                value={values.username}
                                error={
                                    errors.username
                                        ? errors.username
                                        : undefined
                                }
                            />
                        </div>
                        <div className="fixed left-0 md:left-auto bottom-16 px-[16px] md:px-0 w-full md:w-[400px]">
                            <Button
                                disabled={
                                    (initialValues.full_name === values.full_name &&
                                        initialValues.username ===
                                            values.username) ||
                                    isTyping ||
                                    !isFormValid
                                }
                                variant="custom"
                                className="w-full mt-4 text-white bg-accent-purple"
                                type="submit">
                                Selanjutnya
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
};
