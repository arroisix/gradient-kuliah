import Button from 'commons/components/elements/Button';
import { AUTHENTICATION_ROUTE } from 'commons/constants';
import Link from 'next/link';

const JoinGradient = (): JSX.Element => {
    return (
        <section className="min-h-[60vh] md:h-screen w-full px-4 md:px-[7.5rem] py-4 flex flex-col justify-center items-center relative overflow-hidden">
            <h2 className="text-3xl lg:text-5xl font-bold text-center w-[90vw] md:w-[50rem] z-10">
                Gabung Gradient Sekarang
            </h2>
            <div className="z-10 mt-4 text-center md:w-1/2">
                <span className="text-2xl font-thin text-neutral-300 font-body">
                    Materi lengkap. Video gak bosenin. Murah lagi.
                </span>
            </div>
            <div className="w-screen h-[50vh] md:h-screen absolute flex justify-center items-center">
                <div className="hero-blur-red mr-[15vw]" />
                <div className="hero-blur-blue" />
            </div>
            <div className="flex flex-col my-4 md:flex-row lg:gap-4">
                <Link href={AUTHENTICATION_ROUTE}>
                    <Button variant="primary" className="z-10 md:my-4">
                        Gabung Sekarang
                    </Button>
                </Link>
                <Link href={'/kelas'}>
                    <Button
                        variant="custom"
                        className="z-10 my-4 bg-neutral-800 md:mr-4">
                        Lihat kelas
                    </Button>
                </Link>
            </div>
            <div
                className="w-[200px] h-[200px] lg:w-[517px] lg:h-[517px] rounded-full absolute -left-8 bottom-16 lg:bottom-auto lg:left-64"
                style={{
                    background:
                        'linear-gradient(49.01deg, #252525 16.06%, #000000 71.58%)'
                }}
            />
            <div
                className="w-[43px] h-[43px] lg:w-[151px] lg:h-[151px] rounded-full absolute top-16 right-16 lg:right-60 lg:top-60"
                style={{
                    background:
                        'linear-gradient(233.69deg, #750C03 15.14%, #000000 67.2%, #000000 91.12%)'
                }}
            />
        </section>
    );
};

export default JoinGradient;
