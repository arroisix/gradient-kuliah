import Button from 'commons/components/elements/Button';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
// import { getCSChatRoom } from 'commons/utils';
// import { addZeroBefore } from 'courses/utils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTracker } from 'tracker/tracker';

type HandleIsLastOnboardingStep = () => void;

export const OnboardingSuccess = (): JSX.Element => {
    const router = useRouter();
    // const currentDate = new Date();
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const handleIsLastOnboardingStep: HandleIsLastOnboardingStep = () => {
        localStorage.removeItem('isLastOnboardingStep');
        // redirect to langganan page
        router.push('/langganan');

        // redirect to WhatsApp
        // window.open(
        //     getCSChatRoom("WA")
        // );
    };

    const tracker = useTracker();

    useEffect(() => {
        tracker?.genericTrack('Visit Onboarding Success Step');
    }, []);

    return (
        <section className="relative w-full h-screen bg-gradient-purple overflow-hidden">
            <div className="w-full h-full relative flex flex-col items-center justify-center gap-2 md:gap-3 px-[18px] text-center z-[1]">
                <h1 className="font-sans text-3xl md:text-4xl font-extrabold">
                    Selamat Datang di{' '}
                    <span className=" font-[Urbanist]">Gradient</span>
                </h1>
                <span className="inline-block font-body ">
                    Mulai dengan memilih paket yang cocok untukmu
                </span>
                <Button
                    id={'checkout-cta'}
                    onClick={handleIsLastOnboardingStep}
                    variant="primary"
                    size="small"
                    className="!px-[76px] !mt-[14px] !md:mt-3 !font-extrabold">
                    Beli Paket
                </Button>
            </div>
            <EllipseGroup />
            <Image
                src={
                    isMobileBreakpoints
                        ? 'https://assets.gradient.academy/assets/welcome-dots-mobile.png'
                        : 'https://assets.gradient.academy/assets/welcome-dots.png'
                }
                loading="lazy"
                sizes="none"
                layout="fill"
                className="object-cover"
            />
        </section>
    );
};

const EllipseGroup = (): JSX.Element => {
    return (
        <div className="w-[900px] h-[900px] md:w-[1400px] md:h-[1400px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full border-[1px] border-white/5 rounded-full"></div>
            <div className="absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] w-[80%] h-[80%] border-[1px] border-white/5 rounded-full"></div>
            <div className="absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] w-[60%] h-[60%] border-[1px] border-white/10 rounded-full"></div>
            <div className="absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] w-[40%] h-[40%] border-[1px] border-white/20 rounded-full"></div>
        </div>
    );
};
