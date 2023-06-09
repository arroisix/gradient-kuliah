import { CgBell } from 'react-icons/cg';
import { GoHome } from 'react-icons/go';
import { HiOutlineAcademicCap } from 'react-icons/hi';

export const PROFILE_MENUS = [
    {
        label: 'Profil Umum',
        Icon: CgBell,
        url: 'edit-profil'
    },
    {
        label: 'Data Umum',
        Icon: GoHome,
        url: 'edit-data-umum'
    },
    {
        label: 'Pendidikan',
        Icon: HiOutlineAcademicCap,
        url: 'edit-pendidikan'
    }
];
