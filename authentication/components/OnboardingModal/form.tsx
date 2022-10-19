import { Formik } from 'formik';
import moment from 'moment';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import Radio from 'commons/components/elements/Form/radio';
import Select from 'commons/components/elements/Form/select';
import {
    useGetRegisterReferenceQuery,
    useUpdateUserMutation
} from 'authentication/redux/api/authApi';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { useEffect, useState } from 'react';

const FormSection = ({
    openDialog
}: {
    openDialog: (status: 1 | 0) => void;
}): JSX.Element => {
    const [step, setStep] = useState(0);
    const [update, { isLoading, isSuccess }] = useUpdateUserMutation();
    const { data: registerReferences, isLoading: isLoadingReferences } =
        useGetRegisterReferenceQuery({});
    const user = useSelector(getCurrentUser);

    useEffect(() => {
        if (isSuccess) {
            openDialog(1);
        }
    }, [isSuccess]);

    return (
        <div className="w-full flex flex-col">
            <Formik
                initialValues={{ gender: 'MALE' } as UpdateUserInputData}
                onSubmit={async (values, { setSubmitting }) => {
                    await update({
                        ...values,
                        birthdate: moment(values.birthdate).format(
                            'YYYY-MM-DD'
                        ),
                        phone_number: values.phone_number?.toString(),
                        full_name: user.full_name
                    });
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
                        <div id="step-0" className={step === 0 ? '' : 'hidden'}>
                            <h1 className="text-3xl text-center font-bold mb-8">
                                Lengkapi Akunmu
                            </h1>
                            <Input
                                type="date"
                                label="TANGGAL LAHIR"
                                name="birthdate"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.birthdate}
                                error={
                                    touched.birthdate && errors.birthdate
                                        ? errors.birthdate
                                        : undefined
                                }
                            />
                            <Radio
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.gender}
                                name="gender"
                                label="JENIS KELAMIN"
                                options={[
                                    {
                                        key: 'MALE',
                                        value: 'Laki-Laki'
                                    },
                                    {
                                        key: 'FEMALE',
                                        value: 'Perempuan'
                                    }
                                ]}
                            />
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
                                label="TINGKAT PENDIDIKAN"
                                value={values.education_level}
                                name="educationLevel"
                                option={[
                                    {
                                        key: 'SMP',
                                        value: 'SMP'
                                    },
                                    {
                                        key: 'SMA',
                                        value: 'SMA'
                                    },
                                    {
                                        key: 'SMK',
                                        value: 'SMK'
                                    },
                                    {
                                        key: 'S1',
                                        value: 'Sarjana'
                                    },
                                    {
                                        key: 'S2',
                                        value: 'Magister'
                                    }
                                ]}
                            />
                            <Input
                                type="text"
                                label="INSTITUSI"
                                name="institution"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.institution}
                                error={
                                    touched.institution && errors.institution
                                        ? errors.birthdate
                                        : undefined
                                }
                            />
                            <Input
                                type="number"
                                label="NOMOR HANDPHONE"
                                placeholder="8211234567"
                                name="phone_number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                startAddorment={
                                    <p className="text-neutral-200">+62</p>
                                }
                                value={values.phone_number}
                                error={errors.phone_number}
                            />
                            <Button
                                variant="custom"
                                className="bg-accent-purple text-white mt-4 w-full"
                                type="button"
                                onClick={() => {
                                    // TODO: validation
                                    // validate fields
                                    // const fields = [
                                    //     'birthdate',
                                    //     'gender',
                                    //     'education_level',
                                    //     'institution',
                                    //     'phone_number'
                                    // ];

                                    // for (const f of fields) {
                                    //     validateField(f);
                                    // }

                                    // validate errors
                                    // let isStepOneError = false;
                                    // for (const f of fields) {
                                    //     isStepOneError = isStepOneError
                                    // }

                                    // console.log(errors);

                                    // if (
                                    //     !errors.birthdate &&
                                    //     !errors.gender &&
                                    //     !errors.education_level &&
                                    //     !errors.institution &&
                                    //     !errors.phone_number
                                    // ) {
                                    // }
                                    setStep(1);
                                }}>
                                Selanjutnya
                            </Button>
                        </div>
                        {/* PART 2 */}
                        <div id="step-1" className={step === 1 ? '' : 'hidden'}>
                            <Radio
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.gender}
                                name="gender"
                                label="DARI MANA KAMU MENGETAHUI GRADIENT?"
                                options={
                                    !isLoadingReferences && registerReferences
                                        ? registerReferences.data.map(
                                              (ref) => ({
                                                  key: ref.id,
                                                  value: ref.name
                                              })
                                          )
                                        : ([] as {
                                              key: string;
                                              value: string;
                                          }[])
                                }
                            />
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
                                    {isLoading ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default FormSection;
