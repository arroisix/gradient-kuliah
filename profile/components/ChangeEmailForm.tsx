import { Formik } from 'formik';
import {
    useUpdateUserMutation,
    useRequestEmailActivationMutation
} from 'authentication/redux/api/authApi';
import Input from 'commons/components/elements/Form/input';
import Button from 'commons/components/elements/Button';
import { toast } from 'react-toastify';
import { useProfileContext } from '../contexts/ProfileProvider';
import { useState } from 'react';
import EmailVerificationModal from 'dashboard/components/EmailVerification/EmailVerificationModal';
import { useTracker } from 'tracker/tracker';

interface ErrorResponse {
    data?: {
        message?: string;
        errors?: {
            [key: string]: string[];
        };
    };
}

export const ChangeEmailForm = (): JSX.Element => {
    const { profile } = useProfileContext();
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const [requestEmailActivation] = useRequestEmailActivationMutation();
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const tracker = useTracker();

    return (
        <>
            <Formik
                initialValues={{
                    email: ''
                }}
                validate={(values) => {
                    const errors: { [key: string]: string } = {};
                    if (!values.email) {
                        errors.email = 'Email dibutuhkan';
                    } else if (values.email === profile?.email) {
                        errors.email = 'Tidak boleh sama dengan email sekarang';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                            values.email
                        )
                    ) {
                        errors.email = 'Email tidak valid';
                    }
                    return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    if (!profile) return;

                    try {
                        const phoneNumber = profile.phone_number.replace(
                            /\+/g,
                            ''
                        );
                        const payload: UpdateUserInputData = {
                            email: values.email,
                            gender: profile.gender,
                            full_name: profile.full_name,
                            phone_number: phoneNumber,
                            username: profile.username,
                            birthdate: profile.birthdate,
                            education_level: profile.education_level,
                            institution: profile.institution,
                            major: profile.major,
                            profession: profile.profession,
                            profession_field: profile.profession_field
                        };

                        tracker?.genericTrack('User Change Email', {
                            old_email: profile.email,
                            new_email: values.email
                        });

                        await updateUser(payload).unwrap();
                        setNewEmail(values.email);
                        await requestEmailActivation().unwrap();
                        setShowVerificationModal(true);
                    } catch (error) {
                        const err = error as ErrorResponse;
                        if (err.data?.message === 'EMAIL_ALREADY_EXISTS') {
                            toast.error(
                                'Email ini telah dipakai oleh akun lain',
                                {
                                    position: toast.POSITION.TOP_CENTER
                                }
                            );
                        } else if (err.data?.errors) {
                            const errorMessages = Object.entries(
                                err.data.errors
                            ).map(([field, messages]) => {
                                if (Array.isArray(messages)) {
                                    return `${field}: ${messages.join(', ')}`;
                                }
                                return `${field}: ${messages}`;
                            });
                            errorMessages.forEach((message) => {
                                toast.error(message, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                            });
                        } else {
                            toast.error(
                                'Gagal mengubah email. Pastikan semua data profil telah terisi.',
                                {
                                    position: toast.POSITION.TOP_CENTER
                                }
                            );
                        }
                    }
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
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-white">
                                    Email Lama
                                </label>
                                <span className="text-gray-400">
                                    {profile?.email}
                                </span>
                            </div>
                            <Input
                                label="Email Baru"
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                    touched.email && errors.email
                                        ? errors.email
                                        : undefined
                                }
                                placeholder="Masukkan email baru"
                            />
                            <Button
                                type="submit"
                                disabled={isSubmitting || isLoading || !profile}
                                variant="custom"
                                className="w-full mt-4 text-white bg-accent-purple">
                                {isLoading || isSubmitting ? (
                                    <span className="loading loading-spinner loading-sm" />
                                ) : (
                                    'Ganti'
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>

            <EmailVerificationModal
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
                email={newEmail}
            />
        </>
    );
};
