import PrivacyIcon from 'commons/components/elements/Icons/PrivacyPolicy';
import TnCIcon from 'commons/components/elements/Icons/TnC';
import { EducationLevelForm } from 'profile/components/EducationLevelForm';
import { GeneralProfileForm } from 'profile/components/GeneralProfileForm';
import { PerangkatTerhubungForm } from 'profile/components/PerangkatTerhubungForm';
import { PersonalDataForm } from 'profile/components/PersonalDataForm';
import { HiOutlineAcademicCap, HiOutlineCreditCard } from 'react-icons/hi';
import { MdOutlineMail, MdOutlinePhoneAndroid } from 'react-icons/md';
import { ChangeEmailForm } from '../components/ChangeEmailForm';
import { FiUser } from 'react-icons/fi';
import { FaRegAddressCard } from 'react-icons/fa6';
import CreditCardList from 'profile/components/kartu-kredit/CreditCardList';
import CreditCardDetails from 'profile/components/kartu-kredit/CreditCardDetails';
import AddCardForm from 'profile/components/kartu-kredit/AddCardForm';

export const PROFILE_MENUS = [
    {
        label: 'Profil Umum',
        Icon: FiUser,
        url: 'profil/profil-umum'
    },
    {
        label: 'Data Diri',
        Icon: FaRegAddressCard,
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
        label: 'Kartu Kredit/Debit',
        Icon: HiOutlineCreditCard,
        url: 'profil/kartu-kredit'
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
    '/profil/ganti-email': ChangeEmailForm,
    '/profil/kartu-kredit': CreditCardList,
    '/profil/kartu-kredit/tambah-kartu': AddCardForm,
    '/profil/kartu-kredit/[id]': CreditCardDetails
};
