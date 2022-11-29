import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';
import Button from 'commons/components/elements/Button';

const JoinGradient = (): JSX.Element => {
    const { setModalAuthOpen } = useAuth();
    const router = useRouter();
    return (
        <section className="min-h-[60vh] md:h-screen w-full px-4 md:px-[7.5rem] py-4 flex flex-col justify-center items-center relative overflow-hidden">
            <h2 className="text-3xl lg:text-5xl font-bold text-center w-[90vw] md:w-[50rem] z-10">
                Gabung Gradient Sekarang
            </h2>
            <div className="md:w-1/2 text-center z-10 mt-4">
                <span className="text-neutral-300 text-2xl font-body font-thin">
                    Materi lengkap. Video gak bosenin. Murah lagi.
                </span>
            </div>
            <div className="w-screen h-[50vh] md:h-screen absolute flex justify-center items-center">
                <div className="hero-blur-red mr-[15vw]" />
                <div className="hero-blur-blue" />
            </div>
            <div className="flex flex-col md:flex-row lg:gap-4 my-4">
                <Button
                    variant="primary"
                    className="md:my-4 z-10"
                    onClick={() => setModalAuthOpen(1)}>
                    Gabung Sekarang
                </Button>
                <Button
                    variant="custom"
                    className="bg-neutral-800  my-4 z-10 md:mr-4"
                    onClick={() => router.push('/kelas')}>
                    Lihat kelas
                </Button>
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
