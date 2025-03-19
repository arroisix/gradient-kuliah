import React from 'react';

const FlashcardGeneratingContent = (): JSX.Element => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 p-12 bg-[#1D1D1D] rounded-lg mt-2 mb-6">
            <h3 className="text-xl font-semibold text-white text-center">
                Sedang menyusun flashcard
            </h3>

            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-t-[#5F2BCE] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>

            <p className="text-neutral-400 text-center">
                Selesai dalam 1-3 menit
            </p>

            <div className="bg-[#20222E] px-4 py-2 rounded-lg">
                <p className="text-neutral-400 text-center text-sm">
                    Kamu akan mendapat notifikasi di email saat flashcard
                    selesai dibuat
                </p>
            </div>
        </div>
    );
};

export default FlashcardGeneratingContent;
