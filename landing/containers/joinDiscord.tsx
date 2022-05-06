import Button from 'commons/components/elements/Button';

const JoinDiscord = (): JSX.Element => {
    return (
        <section
            className="px-[7.5rem] py-4 h-[80vh] flex items-center justify-center flex-col mt-32"
            style={{
                // background: `url(assets/discord.png)`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top'
            }}>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-accent-purple to-[#B73E32] text-transparent bg-clip-text p-1 text-center">
                Gabung Discord Gradient
            </h1>
            <h1 className="text-6xl font-bold"> buat belajar bareng</h1>
            <span className="text-neutral-400 my-8">
                <span className="text-white">Gabung</span> bareng orang - orang
                yang bisa motivasi kamu belajar dan nugas.
            </span>
            <Button variant="primary">Gabung Discord</Button>
        </section>
    );
};

export default JoinDiscord;
