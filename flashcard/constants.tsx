export enum FlashcardSort {
    trending = 'trending',
    view = 'view',
    like = 'like'
}

export const FLASHCARD_SORT_OPTIONS = [
    { value: FlashcardSort.trending, label: 'Trending' },
    { value: FlashcardSort.view, label: 'Paling Banyak Dilihat' },
    { value: FlashcardSort.like, label: 'Paling Disukai' }
];

export enum FlashcardTabStyle {
    active = 'border-accent-purple font-bold px-4 sm:px-6 md:px-8',
    activeNeutral = 'border-[#C4B9FF] font-bold px-4 sm:px-6 md:px-8',
    default = 'border-[#2D2D2D] hover:text-graphite-400 hover:border-graphite-600 font-medium text-neutral-500 px-2 sm:px-4 md:px-6'
}

export enum FlashcardTab {
    all = 'all',
    yours = 'user'
}
