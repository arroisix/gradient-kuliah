import QuestionCard from 'komunitas/components/QuestionCard';
import React from 'react';

const KomunitasContainer = (): JSX.Element => {
    return (
        <section className="flex flex-col md:flex-row gap-[2rem]">
            <div className="w-full md:w-9/12">
                <QuestionCard />
            </div>
            <div className="hidden md:block w-full md:w-3/12">Pertanyaanku</div>
        </section>
    );
};

export default KomunitasContainer;
