import Button from 'src/commons/components/elements/Button';

const Hero = (): JSX.Element => {
    return (
        <section className="h-screen w-full px-4 md:px-[7.5rem] py-4 flex flex-col justify-center items-center relative">
            <h1 className="text-2xl md:text-5xl font-bold text-center w-full md:w-[30rem] z-10">
                Belajar dengan pengajar terbaik di seluruh Indonesia
            </h1>
            <div className="w-full md:w-1/2 text-center z-10 mb-4">
                <span className="text-neutral-300">
                    Menyediakan materi belajar yang lengkap untukmu dan video
                    belajar yang gak ngebosenin.
                </span>
            </div>
            <div className="w-screen h-screen absolute flex justify-center items-center">
                <div className="hero-blur-red mr-[15vw]" />
                <div className="hero-blur-blue" />
            </div>
            <Button variant="primary">Segera :)</Button>
        </section>
    );
};

export default Hero;
