import React from 'react';

const FlashcardGeneratingContent = (): JSX.Element => {
    return (
        <div className="flex flex-col items-center justify-center gap-3 p-12 bg-[#1D1D1D] rounded-lg mt-2 mb-6">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-t-[#5F2BCE] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <h3 className="text-base md:text-xl text-center md:text-start font-semibold text-white">
                Sedang menyusun flashcard
            </h3>
            <p className="text-neutral-400 text-center text-sm md:text-base">
                Kamu akan mendapat notifikasi lewat email saat flashcard selesai
                dibuat
            </p>
        </div>
    );
};

export default FlashcardGeneratingContent;
