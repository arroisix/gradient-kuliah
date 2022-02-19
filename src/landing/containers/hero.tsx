import { useRouter } from 'next/router';
import { useAuth } from 'src/authentication/contexts/AuthProvider';
import EffectButton from 'src/commons/components/elements/Button/effect';

const Hero = (): JSX.Element => {
    const { setModalAuthOpen, isAuthenticated } = useAuth();
    const router = useRouter();
    return (
        <section className="h-screen w-full px-[7.5rem] py-4 flex flex-col justify-center items-center relative">
            <h1 className="text-[3rem] font-bold text-center w-[30rem] z-10">
                Belajar dengan pengajar terbaik di seluruh Indonesia
            </h1>
            <div className="w-1/2 text-center z-10">
                <span className="font-thin text-neutral-300">
                    Menyediakan materi belajar yang lengkap untukmu dan video
                    belajar yang gak ngebosenin.
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
                <EffectButton
                    className="bg-accent-purple my-4 z-10"
                    onClick={() => setModalAuthOpen(1)}>
                    Gabung Sekarang
                </EffectButton>
            )}
        </section>
    );
};

export default Hero;
