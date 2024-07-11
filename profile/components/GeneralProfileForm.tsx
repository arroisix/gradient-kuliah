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
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import Avatar from 'react-avatar';
import useUploadFile from 'commons/hooks/useUploadFile';
import Image from 'next/image';
import { useTracker } from 'tracker/tracker';
import { useHandleSuccessfulForm } from 'profile/utils';

export const GeneralProfileForm = (): JSX.Element => {
    const tracker = useTracker();
    const { handleSuccessfulForm } = useHandleSuccessfulForm();

    const [isValid, setIsValid] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [previewImage, setPreviewImage] = useState<
        string | ArrayBuffer | null
    >(null);
    const { isLoading, updateUser, profile } = useProfileContext();
    const { uploadFile } = useUploadFile('public_student');
    const [checkUsernameAvailability, { isLoading: isCheckUsernameLoading }] =
        useCheckUsernameAvailabilityMutation();

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
        <Formik
            initialValues={
                {
                    full_name: profile?.full_name || '',
                    username: profile?.username || '',
                    photo_profile: profile?.photo_profile || ''
                } as UpdateGeneralProfileInputData
            }
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const { photo_profile_file, ...res } = values;

                const payload = {
                    ...profile,
                    ...res
                };

                if (!!photo_profile_file) {
                    const fileUrls = await uploadFile([...photo_profile_file]);

                    if (!fileUrls || fileUrls.length <= 0) {
                        return toast.error(
                            `Terjadi kesalahan saat mengupload foto profil`,
                            {
                                position: toast.POSITION.TOP_CENTER
                            }
                        );
                    }

                    payload.photo_profile = fileUrls[0];
                }

                tracker?.trackAttemptFormSubmit(
                    'General Profile Data',
                    payload
                );

                const result = await updateUser(payload);

                if (!(result as ReduxHTTPError).error) {
                    handleSuccessfulForm();
                }

                return setSubmitting(false);
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
                isValid: isFormValid,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                setFieldError
            }) => (
                <form onSubmit={handleSubmit} className="container">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center w-full">
                            <div className="w-1/6">
                                {!!profile?.photo_profile || !!previewImage ? (
                                    <div className="w-[43px] h-[43px] relative">
                                        <Image
                                            src={
                                                !!previewImage || !profile
                                                    ? (previewImage as string)
                                                    : profile.photo_profile
                                            }
                                            layout="fill"
                                            className="rounded-full"
                                        />
                                    </div>
                                ) : (
                                    <Avatar
                                        name={profile?.username}
                                        size="43"
                                        round
                                    />
                                )}
                            </div>

                            <div className="flex flex-col w-5/6">
                                <span className="text-[#FFFFFF]">
                                    {profile?.username}
                                </span>
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="photo-profile"
                                        className="text-[#B6A6F3] hover:text-[#B6A6F3]/75 cursor-pointer">
                                        Ganti foto profile
                                    </label>
                                    <input
                                        id="photo-profile"
                                        className="hidden"
                                        type="file"
                                        name="photo_profile_file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            const files = event.target.files;
                                            if (
                                                !!files &&
                                                files[0] &&
                                                files[0].size > 3 * 1024 * 1024
                                            ) {
                                                setFieldError(
                                                    'photo_profile_file',
                                                    'Ukuran foto tidak boleh lebih dari 3Mb'
                                                );
                                            } else {
                                                // Preview the selected image
                                                if (files) {
                                                    const reader =
                                                        new FileReader();
                                                    reader.onloadend = () => {
                                                        setPreviewImage(
                                                            reader.result
                                                        );
                                                    };
                                                    reader.readAsDataURL(
                                                        files[0]
                                                    );
                                                } else {
                                                    setPreviewImage(null);
                                                }

                                                setFieldError(
                                                    'photo_profile_file',
                                                    undefined
                                                );
                                                setFieldValue(
                                                    'photo_profile_file',
                                                    event.target.files
                                                );
                                            }
                                        }}
                                    />
                                    {errors.photo_profile_file && (
                                        <small className="text-sm text-red-500">
                                            {errors.photo_profile_file}
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>
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
                                initialValues.username !== values.username ? (
                                    <Icon
                                        className={` ${
                                            isCheckUsernameLoading || isTyping
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
                                    } else if (event.target.value.length > 16) {
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
                                errors.username ? errors.username : undefined
                            }
                        />
                    </div>
                    <Button
                        disabled={
                            isLoading ||
                            (initialValues.full_name === values.full_name &&
                                initialValues.photo_profile_file ===
                                    values.photo_profile_file &&
                                initialValues.username === values.username) ||
                            isTyping ||
                            !isFormValid
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
