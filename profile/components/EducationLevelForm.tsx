import {
    EDUCATION_OPTIONS,
    PROFESSION_OPTIONS
} from 'authentication/constants';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import Select from 'commons/components/elements/Form/select';
import Spinner from 'commons/components/elements/Spinner';
import { Formik } from 'formik';
import {
    ReduxHTTPError,
    useProfileContext
} from 'profile/contexts/ProfileProvider';
import { toast } from 'react-toastify';

export const EducationLevelForm = (): JSX.Element => {
    const { isLoading, updateUser, profile } = useProfileContext();
    return (
        <Formik
            initialValues={
                {
                    education_level: profile?.education_level || '',
                    institution: profile?.institution || '',
                    major: profile?.major || '',
                    profession: profile?.profession || '',
                    profession_field: profile?.profession_field || ''
                } as UpdateUserResponseData
            }
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const payload = {
                    ...profile,
                    ...values
                };

                if (payload.profession !== 'employed') {
                    payload.profession_field = '';
                }

                const result = await updateUser(payload);

                if (!(result as ReduxHTTPError).error) {
                    toast.success(`Perubahan berhasil disimpan`, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }

                setSubmitting(false);
            }}
            validate={(values) => {
                const errors: { [key: string]: string } = {};

                if (!values.education_level)
                    errors.education_level =
                        'Tingkat pendidikan tidak boleh kosong';
                if (!values.institution)
                    errors.institution =
                        'Asal sekolah/universitas tidak boleh kosong';
                if (!values.major) errors.major = 'Jurusan tidak boleh kosong';
                if (!values.profession)
                    errors.profession = 'Pekerjaan tidak boleh kosong';
                if (
                    values.profession === 'employed' &&
                    !values.profession_field
                )
                    errors.profession_field =
                        'Bidang pekerjaan tidak boleh kosong';

                return errors;
            }}>
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
                        <Select
                            onChange={(e) =>
                                handleChange({
                                    target: {
                                        value: e.target.value,
                                        name: 'education_level'
                                    }
                                })
                            }
                            onBlur={handleBlur}
                            label="Tingkat Pendidikan"
                            value={values.education_level}
                            name="educationLevel"
                            option={EDUCATION_OPTIONS}
                            error={
                                touched.education_level &&
                                errors.education_level
                                    ? errors.education_level
                                    : undefined
                            }
                        />
                        <Input
                            type="text"
                            label="Asal Sekolah/Universitas"
                            name="institution"
                            placeholder="Nama sekolah atau universitas"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.institution}
                            error={
                                touched.institution && errors.institution
                                    ? errors.institution
                                    : undefined
                            }
                            required={true}
                        />
                        <Input
                            type="text"
                            label="Jurusan"
                            name="major"
                            placeholder="Nama jurusan"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.major}
                            error={
                                touched.major && errors.major
                                    ? errors.major
                                    : undefined
                            }
                            required={true}
                        />
                        <Select
                            onChange={(e) =>
                                handleChange({
                                    target: {
                                        value: e.target.value,
                                        name: 'profession'
                                    }
                                })
                            }
                            onBlur={handleBlur}
                            label="Pekerjaan"
                            value={values.profession}
                            name="profession"
                            option={PROFESSION_OPTIONS}
                            error={
                                touched.profession && errors.profession
                                    ? errors.profession
                                    : undefined
                            }
                        />
                        {values.profession === 'employed' && (
                            <Input
                                type="text"
                                label="Bidang Pekerjaan"
                                name="profession_field"
                                placeholder="Nama bidang"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.profession_field}
                                error={
                                    touched.profession_field &&
                                    errors.profession_field
                                        ? errors.profession_field
                                        : undefined
                                }
                                required={values.profession === 'employed'}
                            />
                        )}
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
