import Button from 'commons/components/elements/Button';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Container from 'landing/components/Container';
import Image from 'next/image';
import Link from 'next/link';

const Hero = (): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    return (
        <Container className="relative flex flex-col gap-12 bg-gradient-purple pt-28 pb-16 md:pb-28 overflow-hidden">
            <div className="absolute w-screen h-[30%] bottom-0 left-[50%] translate-x-[-50%] bg-gradient-to-b from-transparent to-black z-[19]"></div>
            <div className="w-full mx-auto flex flex-col">
                <h1 className="text-2xl font-extrabold text-center whitespace-pre-line sm:text-4xl lg:text-5xl z-[1]">
                    {'Platform Belajar Kuliah \n No. 1 di Indonesia'}
                </h1>
                <Link href={'#pricing'}>
                    <Button
                        variant="primary"
                        className="w-fit mx-auto z-10 mt-[14px] lg:mt-6 sm:px-[47px] sm:py-2 font-sans text-xs sm:text-sm lg:text-base">
                        Gabung Kelas
                    </Button>
                </Link>
            </div>
            <div className="w-full max-w-[1440px] mx-auto">
                <VideoPlayerImage />
            </div>
            <EllipseGroup />
            <Image
                src={
                    isMobileBreakpoints
                        ? 'https://assets.gradient.academy/assets/hero-dots-mobile.png'
                        : 'https://assets.gradient.academy/assets/hero-dots.png'
                }
                loading="lazy"
                sizes="none"
                layout="fill"
                className="object-cover"
            />
        </Container>
    );
};

const EllipseGroup = (): JSX.Element => {
    return (
        <div className="w-[600px] h-[600px] sm:w-[1100px] sm:h-[1100px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] mt-28">
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full border-[1px] border-white/5 rounded-full"></div>
            <div className="absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] w-[80%] h-[80%] border-[1px] border-white/10 rounded-full"></div>
            <div className="absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] w-[60%] h-[60%] border-[1px] border-white/20 rounded-full"></div>
            <div className="absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] w-[40%] h-[40%] border-[1px] border-white/25 rounded-full"></div>
            <div className="absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] w-[20%] h-[20%] border-[1px] border-white/30 rounded-full"></div>
        </div>
    );
};

const VideoPlayerImage = (): JSX.Element => {
    return (
        <div className="relative w-full md:w-[70%] mx-auto bg-[#121212] z-10 rounded-3xl overflow-hidden">
            <div className="flex w-full gap-2 p-4">
                <div className="w-3 h-3 rounded-full bg-accent-purple" />
                <div className="w-3 h-3 rounded-full bg-accent-purple" />
                <div className="w-3 h-3 rounded-full bg-accent-purple" />
            </div>
            <div className="w-full h-full overflow-hidden">
                <div className="w-full h-full">
                    <Image
                        src="https://assets.gradient.academy/assets/thumb-1.jpg"
                        loading="lazy"
                        className="object-cover"
                        layout="responsive"
                        height={350}
                        width={600}
                    />
                </div>
                <div className="absolute left-0 w-full h-5 p-4 bottom-3">
                    <div className="w-full h-1 md:h-2 bg-[#373737] rounded-2xl relative">
                        <div className="rounded-full h-2 w-2 md:h-4 md:w-4 bg-accent-purple absolute bottom-[-2px] md:bottom-[-4px] left-48" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
