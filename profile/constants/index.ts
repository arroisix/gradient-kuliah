import { EducationLevelForm } from 'profile/components/EducationLevelForm';
import { GeneralProfileForm } from 'profile/components/GeneralProfileForm';
import { PersonalDataForm } from 'profile/components/PersonalDataForm';
import { CgBell } from 'react-icons/cg';
import { GoHome } from 'react-icons/go';
import { HiOutlineAcademicCap } from 'react-icons/hi';

export const PROFILE_MENUS = [
    {
        label: 'Profil Umum',
        Icon: CgBell,
        url: 'profil/umum'
    },
    {
        label: 'Data Diri',
        Icon: GoHome,
        url: 'profil/data-diri'
    },
    {
        label: 'Pendidikan',
        Icon: HiOutlineAcademicCap,
        url: 'profil/pendidikan'
    }
];

interface ProfileManagementFormsInterface {
    [path: string]: React.FC;
}

export const PROFILE_MANAGEMENT_FORMS: ProfileManagementFormsInterface = {
    '/profil/umum': GeneralProfileForm,
    '/profil/data-diri': PersonalDataForm,
    '/profil/pendidikan': EducationLevelForm
};
