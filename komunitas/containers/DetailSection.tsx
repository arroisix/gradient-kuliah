import AnswerCard from 'komunitas/components/AnswerCard';

const DetailSection = (): JSX.Element => {
    return (
        <section className="flex flex-col md:flex-row gap-[2rem]">
            <div className="w-full md:w-9/12">
                <AnswerCard isVerified={true} />
            </div>
            <div className="hidden md:block w-full md:w-3/12">similair</div>
        </section>
    );
};

export default DetailSection;
