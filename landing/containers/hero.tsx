import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';
import TextTransition, { presets } from 'react-text-transition';
import Button from 'commons/components/elements/Button';
import EffectButton from 'commons/components/elements/Button/effect';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useEffect, useState } from 'react';

const TEXTS = ['berkoneksi.', 'bertumbuh.', 'berkembang.'];

const Hero = (): JSX.Element => {
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const router = useRouter();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(
            () => setIndex((index) => index + 1),
            2000 // every 3 seconds
        );
        return () => clearTimeout(intervalId);
    }, []);

    return (
        <section className="h-screen w-full px-4 md:px-[7.5rem] py-4 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="bean-container-1">
                <div className="bean1" />
                <div className="bean2" />
            </div>
            <div className="bean-container-2">
                <div className="bean3" />
                <div className="bean4" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-center z-10 flex flex-wrap justify-center items-center gap-3">
                Komunitas untuk Mahasiswa Baru{' '}
                <TextTransition springConfig={presets.stiff}>
                    {TEXTS[index % TEXTS.length]}
                </TextTransition>
            </h1>
            <div className="md:w-1/2 text-center z-10 my-2">
                <span className="font-body text-neutral-300 text-xl lg:text-[32px] font-thin">
                    Pengalaman Kuliah yang Berbeda
                </span>
            </div>
            {isAuthenticated ? (
                <EffectButton
                    className="bg-accent-purple my-4 z-10"
                    onClick={() => router.push('/kelas')}>
                    Belajar Sekarang
                </EffectButton>
            ) : (
                <div className="flex flex-col md:flex-row">
                    <EffectButton
                        className="bg-accent-purple my-4 z-10 md:mr-4"
                        href="https://discord.gg/qU3SB6wxzY">
                        Gabung Discord
                    </EffectButton>
                    <Button
                        variant="custom"
                        className="bg-[#212121] md:my-4 z-10"
                        onClick={() => setModalAuthOpen(1)}>
                        Gabung Sekarang
                    </Button>
                </div>
            )}
        </section>
    );
};

export default Hero;
