import {
    MdFormatListBulleted,
    MdLibraryBooks,
    MdStarPurple500
} from 'react-icons/md';
import { RiQuestionLine, RiTimerLine } from 'react-icons/ri';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

export const LATIHAN_MENU = [
    {
        icon: <MdFormatListBulleted size={18} />,
        label: 'Daftar Latihan',
        value: 'LIST_EXERCISES',
        eventNames: {
            open: 'Open Exercises List Menu',
            close: 'Close Exercises List Menu'
        }
    },
    {
        icon: <RiTimerLine size={18} />,
        label: 'Riwayat Latihan',
        value: 'EXERCISE_HISTORY',
        eventNames: {
            click: 'Click Exercise History Menu'
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

export const PUBLIC_LATIHAN_MENU = [LATIHAN_MENU[0]];

export enum LatihanTabStyle {
    active = 'border-accent-purple font-bold px-4 sm:px-6 md:px-8',
    activeNeutral = 'border-[#C4B9FF] font-bold px-4 sm:px-6 md:px-8',
    default = 'border-[#2D2D2D] hover:text-graphite-400 hover:border-graphite-600 font-medium text-neutral-500 px-2 sm:px-4 md:px-6'
}

export enum LatihanTab {
    all = 'all',
    notStarted = 'not-started',
    completed = 'completed',
    bankSoal = 'bank-soal'
}

export enum LatihanSort {
    latest = 'latest',
    oldest = 'oldest',
    aToZ = 'a-z',
    zToA = 'z-a'
}

export const FILTER_OPTIONS = [
    { value: 'all', label: 'Semua Matkul' },
    { value: 'fisdas1', label: 'Fisika Dasar 1' }
];

export const REVIEW_FILTER_OPTIONS = [
    { value: 'all', label: 'Semua Soal' },
    { value: 'correct', label: 'Jawaban Benar' },
    { value: 'incorrect', label: 'Jawaban Salah' }
];

export const LATIHAN_SORT_OPTIONS = [
    { value: LatihanSort.latest, label: 'Terakhir Rilis' },
    { value: LatihanSort.oldest, label: 'Terlama' },
    { value: LatihanSort.aToZ, label: 'A-Z' },
    { value: LatihanSort.zToA, label: 'Z-A' }
];

export const LATIHAN_STATUS_ICONS = {
    notStarted: <MdLibraryBooks size={18} />,
    inProgress: <RiTimerLine size={18} />,
    completed: <IoMdCheckmarkCircleOutline size={18} />
};

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
