import { useRouter } from 'next/router';
import { useAuth } from 'src/authentication/contexts/AuthProvider';
import Button from 'src/commons/components/elements/Button';
import EffectButton from 'src/commons/components/elements/Button/effect';

const JoinGradient = (): JSX.Element => {
    const { setModalAuthOpen, isAuthenticated } = useAuth();
    const router = useRouter();
    return (
        <section className="min-h-[60vh] md:h-screen w-full px-4 md:px-[7.5rem] py-4 flex flex-col justify-center items-center relative overflow-hidden">
            <h1 className="text-3xl lg:text-5xl font-bold text-center w-[90vw] md:w-[50rem] z-10">
                Gabung{' '}
                <span className="bg-gradient-to-r from-accent-purple to-[#B73E32] text-transparent bg-clip-text">
                    Gradient
                </span>{' '}
                sekarang
            </h1>
            <div className="md:w-1/2 text-center z-10 mt-4">
                <span className="text-neutral-300">
                    Materi lengkap . Video gak bosenin . Murah lagi.
                </span>
            </div>
            <div className="w-screen h-[50vh] md:h-screen absolute flex justify-center items-center">
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

export default JoinGradient;
