import axios from 'axios';
import { Formik } from 'formik';
import Button from 'commons/components/elements/Button';
import Input from 'commons/components/elements/Form/input';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import RegistrationContext from 'authentication/contexts/RegistrationProvider';
import Select from 'commons/components/elements/Form/select';
import {
    EDUCATION_OPTIONS,
    PROFESSION_OPTIONS
} from 'authentication/constants';
import { useTracker } from 'tracker/tracker';
import config from 'redux/api/config';

export const EducationStep = (): JSX.Element => {
    const { setStep, formData, setFormData } = useContext(RegistrationContext);

    const tracker = useTracker();

    const [institutionOption, setInstitutionOption] = useState<Option[]>([]);
    const [majorOption, setMajorOption] = useState<Option[]>([]);
    const [professionFieldOption, setProfessionFieldOption] = useState<Option[]>([]);

    // const loadInstitutionOption = async () => {
    //     // TODO: use this instead
    //     // const { data: institutionData }: { data: Institution[] } =
    //     //     await axios.get(`${config.API_BASE_URL}students/recommendation/institute/`);
    //     const institutionData = [
    //         {name: "UI", abbreviation: "UI"},
    //         {name: "UI", abbreviation: "UI"},
    //         {name: "UI", abbreviation: "UI"},
    //     ];
    //     const option = institutionData.map((institution) => ({
    //         value: institution.name,
    //         label: institution.name,
    //     }));
    //     setInstitutionOption(option);
    //     return option;
    // }
    
    // const loadMajorOption = async () => {
    //     // TODO: use this instead
    //     // const { data: institutionData }: { data: Institution[] } =
    //     //     await axios.get(`${config.API_BASE_URL}students/recommendation/institute/`);
    //     const majorData = [
    //         {name: "IK", abbreviation: "IK"},
    //         {name: "IK", abbreviation: "IK"},
    //         {name: "IK", abbreviation: "IK"},
    //     ];
    //     const option = majorData.map((major) => ({
    //         value: major.name,
    //         label: major.name
    //     }));
    //     setMajorOption(option);
    //     return option;
    // }

    

    // const handleCreateInstitution = (inputValue: string) => {
    //     const newOption = { value: inputValue, label: inputValue };
    //     setInstitutionOption((prev: any) => [...prev, newOption]);
    // };
    
    // const handleCreateMajor = (inputValue: string) => {
    //     const newOption = { value: inputValue, label: inputValue };
    //     setMajorOption((prev: any) => [...prev, newOption]);
    // };

    const getLoadOption = (fieldName: string, setOption: Dispatch<SetStateAction<Option[]>>) => {
        return async () => {
            // TODO: use this instead
            // const { data } =
            //     await axios.get(`${config.API_BASE_URL}students/recommendation/${fieldName}/`);
            const data = [
                {name: "IK", abbreviation: "IK"},
                {name: "IK", abbreviation: "IK"},
                {name: "IK", abbreviation: "IK"},
            ];
            const option = data.map((item) => ({
                value: item.name,
                label: item.name
            }));
            setOption(option);
            return option;
        }
    }

    const getHandleCreate = (setOption: Dispatch<SetStateAction<Option[]>>) => {
        return (input: string) => {
            const newOption = { value: input, label: input };
            setOption((prev: any) => [...prev, newOption]);
        }
    }

    const getHandleSelectChange = (fieldName: string, setFieldValue: (arg1: string, arg2: any) => void) => {
        return (newValue: string) => {
            // FIXME: formik needs to maintain string as value, however react-select need to mainatin Option as value
            setFieldValue(fieldName, newValue);
        }
    }

    useEffect(() => {
        tracker?.genericTrack('Visit Onboarding Education Step');

        getLoadOption('institute', setInstitutionOption)();
        getLoadOption('major', setMajorOption)();

        return () => {
            setInstitutionOption([]);
            setMajorOption([]);
        }

    }, []);

    return (
        <div className="flex flex-col w-full">
            <Formik
                initialValues={
                    {
                        education_level: formData.education_level || '',
                        institution: formData.institution || '',
                        major: formData.major || '',
                        profession: formData.profession || '',
                        profession_field: formData.profession_field || ''
                    } as UpdateUserInputData
                }
                onSubmit={(values) => {
                    setFormData({
                        ...formData,
                        ...values
                    });
                    setStep(3);
                }}
                validate={(values) => {
                    console.log(values)
                    const errors: { [key: string]: string } = {};

                    if (!values.education_level)
                        errors.education_level =
                            'Tingkat pendidikan tidak boleh kosong';
                    if (!values.institution)
                        errors.institution =
                            'Asal sekolah/universitas tidak boleh kosong';
                    if (!values.major)
                        errors.major = 'Jurusan tidak boleh kosong';
                    if (!values.profession)
                        errors.profession = 'Pekerjaan tidak boleh kosong';
                    if (
                        values.profession === 'employed' &&
                        !values.profession_field
                    )
                        errors.profession_field =
                            'Bidang pekerjaan tidak boleh kosong';

                    return errors;
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                }) => {
                    return (
                        <form onSubmit={handleSubmit} className="container">
                            <div className="flex flex-col gap-4">
                                <Select
                                    onChange={getHandleSelectChange('education_level', setFieldValue)}
                                    onBlur={handleBlur}
                                    label="Tingkat Pendidikan"
                                    value={values.education_level}
                                    name="educationLevel"
                                    option={EDUCATION_OPTIONS}
                                    placeholder="Pilih pendidikan"
                                    error={
                                        touched.education_level &&
                                        errors.education_level
                                            ? errors.education_level
                                            : undefined
                                    }
                                />
                                <Select
                                    onChange={getHandleSelectChange('institution', setFieldValue)}
                                    isAsync
                                    loadOption={getLoadOption('institute', setInstitutionOption)}
                                    isCreatable
                                    handleCreate={getHandleCreate(setInstitutionOption)}
                                    onBlur={handleBlur}
                                    value={values.institution}
                                    name="institution"
                                    option={institutionOption}
                                    label={
                                        (values.education_level === "SMP" || values.education_level === "SMA") ? 
                                        "Asal Sekolah" :
                                        "Asal Universitas/Institusi"
                                    }
                                    placeholder={
                                        (values.education_level === "SMP" || values.education_level === "SMA") ? 
                                            "Pilih asal sekolah" :
                                            "Pilih asal universitas/institusi"
                                    }
                                    error={
                                        touched.institution && errors.institution
                                            ? errors.institution
                                            : undefined
                                    }
                                />
                                {(values.education_level !== "SMP") && 
                                    <Select
                                        onChange={getHandleSelectChange('major', setFieldValue)}
                                        isAsync
                                        loadOption={getLoadOption('major', setInstitutionOption)}
                                        isCreatable
                                        handleCreate={getHandleCreate(setMajorOption)}
                                        onBlur={handleBlur}
                                        label="Jurusan"
                                        value={values.major}
                                        name="major"
                                        option={majorOption}
                                        placeholder="Pilih jurusan"
                                        error={
                                            touched.major && errors.major
                                                ? errors.major
                                                : undefined
                                        }
                                    />
                                }
                                <Select
                                    onChange={getHandleSelectChange('profession', setFieldValue)}
                                    onBlur={handleBlur}
                                    label="Pekerjaan"
                                    value={values.profession}
                                    name="profession"
                                    option={PROFESSION_OPTIONS}
                                    placeholder="Pilih pekerjaan"
                                    error={
                                        touched.profession && errors.profession
                                            ? errors.profession
                                            : undefined
                                    }
                                />
                                {values.profession === 'employed' && (
                                    <Select
                                        onChange={getHandleSelectChange('profession_field', setFieldValue)}
                                        isAsync
                                        loadOption={getLoadOption('profession_field', setInstitutionOption)}
                                        isCreatable
                                        handleCreate={getHandleCreate(setProfessionFieldOption)}
                                        onBlur={handleBlur}
                                        value={values.profession_field}
                                        name="institution"
                                        option={professionFieldOption}
                                        label="Bidang Pekerjaan"
                                        placeholder="Pilih bidang pekerjaan"
                                        error={
                                            touched.profession_field &&
                                            errors.profession_field
                                                ? errors.profession_field
                                                : undefined
                                        }
                                    />
                                )}
                            </div>
                            <div className="fixed left-0 md:left-auto bottom-16 px-[16px] md:px-0 w-full md:w-[400px]">
                                <Button
                                    variant="custom"
                                    className="w-full mt-4 text-white bg-accent-purple"
                                    type="submit">
                                    Selanjutnya
                                </Button>
                            </div>
                        </form>
                    )
                }}
            </Formik>
        </div>
    );
};
