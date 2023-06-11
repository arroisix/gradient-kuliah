import { CgBell } from 'react-icons/cg';
import { GoHome } from 'react-icons/go';
import { HiOutlineAcademicCap } from 'react-icons/hi';

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
    }
];
