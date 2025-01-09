import React from 'react';

interface DaftarIsiProps {
    onAddCard: () => void;
}

const DaftarIsi = ({ onAddCard }: DaftarIsiProps): JSX.Element => {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Daftar Isi</h2>
                <button
                    onClick={onAddCard}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-[#5F2BCE] text-white hover:bg-opacity-90 transition-colors">
                    + Tambah Flashcard
                </button>
            </div>

            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-neutral-800 rounded-full mb-4" />
                <p className="text-neutral-400">
                    Flashcard yang kamu buat akan muncul di sini
                </p>
            </div>
        </div>
    );
};

export default DaftarIsi;
