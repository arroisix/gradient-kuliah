import { AiOutlineFontColors } from 'react-icons/ai';
import {
    MdFormatListBulleted,
    MdLibraryBooks,
    MdStarPurple500
} from 'react-icons/md';
import { RiQuestionLine } from 'react-icons/ri';

export const ASTRONOTES_MENU: AstronotesMenuItem[] = [
    {
        icon: <MdFormatListBulleted size={18} />,
        label: 'Daftar Isi',
        value: 'LIST_CONTENT'
    },
    {
        icon: <MdLibraryBooks size={18} />,
        label: 'Bookmark',
        value: 'BOOKMARK'
    },
    {
        icon: <AiOutlineFontColors size={18} />,
        label: 'Opsi Tampilan',
        value: 'SETTING'
    },
    {
        icon: <MdStarPurple500 size={18} />,
        label: 'Beri Penilaian',
        value: 'RATING'
    },
    {
        icon: <RiQuestionLine size={18} />,
        label: 'Bantuan & Masukan',
        value: 'FEEDBACK'
    }
];

export const transitionClassesSlideRight = {
    enter: 'transition transition-[width] ease-out duration-100',
    enterFrom: '-translate-x-full opacity-0 scale-x-0 w-0',
    enterTo: 'translate-x-0 opacity-100 scale-x-100 w-60',
    leave: 'transition transition-[width] ease-in duration-100',
    leaveFrom: 'translate-x-0 opacity-100 scale-x-100 w-60',
    leaveTo: '-translate-x-full opacity-0 scale-x-0 w-0'
};

export const transitionClassesSlideDown = {
    enter: 'transition transition-[height] ease-out duration-100',
    enterFrom: 'opacity-0 scale-y-0',
    enterTo: 'opacity-100 scale-y-100 ',
    leave: 'transition transition-[height] ease-in duration-100',
    leaveFrom: 'opacity-100 scale-y-100',
    leaveTo: 'opacity-0 scale-y-0'
};

export const fontClassName = {
    DEFAULT: 'font-sans',
    MONO: 'font-mono',
    SERIF: 'font-serif'
};
