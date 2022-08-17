import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';
import Button from 'commons/components/elements/Button';
import EffectButton from 'commons/components/elements/Button/effect';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import HALO from 'vanta/dist/vanta.halo.min';
import { useState, useRef, useEffect } from 'react';

const Hero = (): JSX.Element => {
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const router = useRouter();

    const [vantaEffect, setVantaEffect] = useState();
    const myRef = useRef(null);
    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(
                HALO({
                    el: myRef.current,
                    color2: 0x0,
                    baseColor: 0x0,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 500.0,
                    minWidth: 500.0,
                    backgroundColor: 0x0,
                    xOffset: 0.35,
                    yOffset: 0.05,
                    size: 2,
                    amplitudeFactor: 30.0,
                    rotationFactor: 100
                })
            );
        }
        return () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <section className="h-screen w-full px-4 md:px-[7.5rem] py-4 flex flex-col justify-center items-center relative">
            <h1
                className="text-3xl lg:text-5xl font-bold text-center w-[90vw] md:w-[30rem] z-10"
                style={{ lineHeight: '1.35' }}>
                Belajar dengan pengajar terbaik di seluruh Indonesia
            </h1>
            <div className="md:w-1/2 text-center z-10">
                <span className="font-body text-neutral-300">
                    Menyediakan materi belajar yang lengkap untukmu dan video
                    belajar yang gak ngebosenin.
                </span>
            </div>
            <div className="w-screen h-[80vh] absolute blur-xl" ref={myRef} />
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
                        onClick={() => router.push('/kelas')}>
                        Lihat semua kelas
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
