import { useRouter } from 'next/router';
import { useAuth } from 'src/authentication/contexts/AuthProvider';
import Button from 'src/commons/components/elements/Button';
import EffectButton from 'src/commons/components/elements/Button/effect';

const Hero = (): JSX.Element => {
    const { setModalAuthOpen, isAuthenticated } = useAuth();
    const router = useRouter();
    return (
        <section className="h-screen w-full px-4 md:px-[7.5rem] py-4 flex flex-col justify-center items-center relative">
            <h1 className="text-3xl lg:text-5xl font-bold text-center w-[90vw] md:w-[30rem] z-10">
                Masa Depan Kuliah Online di Indonesia 🇮🇩
            </h1>
            <div className="md:w-1/2 text-center z-10">
                <span className="text-neutral-300">
                    Belajar dari guru-guru terbaik, video sinematik, dan menarik
                </span>
            </div>
            <div className="w-screen h-screen absolute flex justify-center items-center">
                <div className="hero-blur-red mr-[15vw]" />
                <div className="hero-blur-blue" />
            </div>
            {isAuthenticated() ? (
                <EffectButton
                    className="bg-accent-purple my-4 z-10"
                    onClick={() => router.push('/kelas')}>
                    Belajar Sekarang
                </EffectButton>
            ) : (
                <div className="flex flex-col md:flex-row">
                    <EffectButton
                        className="bg-accent-purple my-4 z-10 md:mr-4"
                        onClick={() => router.push('/kelas')}>
                        Lihat semua kelas
                    </EffectButton>
                    <Button
                        variant="custom"
                        className="bg-neutral-800 md:my-4 z-10"
                        onClick={() => setModalAuthOpen(1)}>
                        Gabung Sekarang
                    </Button>
                </div>
            )}
        </section>
    );
};

export default Hero;
