import PrivacyIcon from 'commons/components/elements/Icons/PrivacyPolicy';
import TnCIcon from 'commons/components/elements/Icons/TnC';
import { EducationLevelForm } from 'profile/components/EducationLevelForm';
import { GeneralProfileForm } from 'profile/components/GeneralProfileForm';
import { PerangkatTerhubungForm } from 'profile/components/PerangkatTerhubungForm';
import { PersonalDataForm } from 'profile/components/PersonalDataForm';
import { CgBell } from 'react-icons/cg';
import { GoHome } from 'react-icons/go';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { MdOutlineMail, MdOutlinePhoneAndroid } from 'react-icons/md';
import { ChangeEmailForm } from '../components/ChangeEmailForm';

export const PROFILE_MENUS = [
    {
        label: 'Profil Umum',
        Icon: CgBell,
        url: 'profil/profil-umum'
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
    },
    {
        label: 'Ganti Email',
        Icon: MdOutlineMail,
        url: 'profil/ganti-email',
        showIf: (profile?: UpdateUserResponseData) =>
            profile?.provider === 'basic'
    },
    {
        label: 'Perangkat Terhubung',
        Icon: MdOutlinePhoneAndroid,
        url: 'profil/perangkat-terhubung'
    },
    {
        featureFlag: 'legal-pages',
        label: 'Syarat & Ketentuan',
        Icon: TnCIcon,
        url: 'syarat-dan-ketentuan'
    },
    {
        featureFlag: 'legal-pages',
        label: 'Kebijakan Privasi',
        Icon: PrivacyIcon,
        url: 'kebijakan-privasi'
    }
];

interface ProfileManagementFormsInterface {
    [path: string]: React.FC;
}

export const PROFILE_MANAGEMENT_FORMS: ProfileManagementFormsInterface = {
    '/profil/profil-umum': GeneralProfileForm,
    '/profil/data-diri': PersonalDataForm,
    '/profil/pendidikan': EducationLevelForm,
    '/profil/perangkat-terhubung': PerangkatTerhubungForm,
    '/profil/ganti-email': ChangeEmailForm
};
