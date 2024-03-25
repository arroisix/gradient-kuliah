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
        value: 'LIST_CONTENT',
        eventNames: {
            open: 'Open Books List of Content Menu',
            close: 'Close Books List of Content Menu'
        }
    },
    {
        icon: <MdLibraryBooks size={18} />,
        label: 'Bookmark',
        value: 'BOOKMARK',
        eventNames: {
            click: 'Click Bookmark Menu'
        }
    },
    {
        icon: <AiOutlineFontColors size={18} />,
        label: 'Opsi Tampilan',
        value: 'SETTING',
        eventNames: {
            click: 'Click UI Settings Menu'
        }
    },
    {
        icon: <MdStarPurple500 size={18} />,
        label: 'Beri Penilaian',
        value: 'RATING',
        eventNames: {
            click: 'Click Rating Menu'
        }
    },
    {
        icon: <RiQuestionLine size={18} />,
        label: 'Bantuan & Masukan',
        value: 'FEEDBACK',
        eventNames: {
            click: 'Click Feedback Menu'
        }
    }
];
export const PUBLIC_ASTRONOTES_MENU = [ASTRONOTES_MENU[0], ASTRONOTES_MENU[2]];

export const transitionClassesSlideRight = {
    enter: 'transition transition-[width] ease-out duration-100',
    enterFrom: '-translate-x-full opacity-0 scale-x-0 w-0',
    enterTo: 'translate-x-0 opacity-100 scale-x-100 w-60',
    leave: 'transition transition-[width] ease-in duration-100',
    leaveFrom: 'translate-x-0 opacity-100 scale-x-100 w-60',
    leaveTo: '-translate-x-full opacity-0 scale-x-0 w-0'
};

export const transitionClassesSlideDown = {
    enter: 'transition transition-[height] ease-out duration-500 sm:duration-100',
    enterFrom: 'opacity-0 scale-y-0',
    enterTo: 'opacity-100 scale-y-100 ',
    leave: 'transition transition-[height] ease-in duration-500 sm:duration-100',
    leaveFrom: 'opacity-100 scale-y-100',
    leaveTo: 'opacity-0 scale-y-0'
};

export const transitionClassesOpacity = {
    enter: 'transition ease-out duration-200',
    enterFrom: 'opacity-0 translate-y-1',
    enterTo: 'opacity-100 translate-y-0',
    leave: 'transition ease-in duration-150',
    leaveFrom: 'opacity-100 translate-y-0',
    leaveTo: 'opacity-0 translate-y-1'
};

export const fontClassName = {
    DEFAULT: 'font-sans',
    MONO: 'font-mono',
    SERIF: 'font-serif'
};

export const pageSliderClassNames =
    'w-full absolute inset-0 bg-neutral-400 dark:bg-neutral-700 rounded cursor-pointer focus:outline-none focus:outline-0 appearance-none [-webkit-appearance:none] [&::-webkit-slider-runnable-track]:h-full [&::-moz-range-track]:h-full [&::-webkit-slider-runnable-track]:rounded-full [&::-moz-range-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-blue-gray-100 [&::-moz-range-track]:bg-blue-gray-100 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:[-webkit-appearance:none] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:[-webkit-appearance:none] [&::-moz-range-thumb]:rounded-full [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:border-0 [&::-moz-range-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-2 [&::-moz-range-thumb]:ring-current [&::-webkit-slider-thumb]:ring-current [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:relative [&::-webkit-slider-thumb]:relative [&::-moz-range-thumb]:z-20 [&::-webkit-slider-thumb]:z-20 [&::-moz-range-thumb]:w-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-moz-range-thumb]:-mt-[3px] [&::-webkit-slider-thumb]:-mt-[3px]';

export enum TabStyle {
    active = 'border-accent-purple font-bold px-4 sm:px-6 md:px-8',
    default = 'border-[#2D2D2D] font-medium text-neutral-500 px-2 sm:px-4 md:px-6'
}
export enum Tab {
    all = 'all',
    textbook = 'text-book',
    astronotes = 'astronotes',
    soal = 'bank-soal'
}

export enum Sort {
    release = 'last-released',
    read = 'last-read',
    unread = 'unread'
}

export const SORT_OPTIONS = {
    [Sort.release]: 'Terakhir Rilis',
    [Sort.read]: 'Terakhir Dibaca',
    [Sort.unread]: 'Belum Dibaca'
};
