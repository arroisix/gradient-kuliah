import Button from 'commons/components/elements/Button';
import Container from 'landing/components/Container';
import Image from 'next/image';
import Link from 'next/link';

const Hero = (): JSX.Element => {
    return (
        <Container className="flex-col gap-16 md:flex-row-reverse md:gap-2 md:items-center">
            <div className="w-full mt-32 md:mt-0">
                <div className="h-[300px] md:h-[380px] w-full relative">
                    <div
                        className="absolute rounded-full w-[51px] h-[51px] lg:w-[130px] lg:h-[130px] -bottom-4 -left-4 lg:-left-16 z-0"
                        style={{
                            background:
                                'linear-gradient(330.33deg, #5F2BCE 4.61%, #030C14 84.77%)',
                            transform: 'rotate(-180deg)'
                        }}
                    />
                    <div
                        className="absolute rounded-full w-[84px] h-[84px] lg:w-[216px] lg:h-[216px] top-2 lg:top-12 -right-4 lg:-right-16 z-0"
                        style={{
                            background:
                                'linear-gradient(330.33deg, #5F2BCE 4.61%, #030C14 84.77%)',
                            transform: 'rotate(-180deg)'
                        }}
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-[#121212] z-10 rounded-3xl overflow-hidden">
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
                                    height={450}
                                    width={600}
                                />
                            </div>
                            <div className="absolute left-0 w-full h-5 p-4 bottom-3">
                                <div className="w-full h-1 bg-[#373737] rounded-2xl relative">
                                    <div className="rounded-full h-2 w-2 bg-accent-purple absolute bottom-[-2px] left-48" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <h1 className="text-2xl font-bold text-center lg:text-5xl lg:text-left">
                    Platform Belajar Kuliah No. 1 di Indonesia
                </h1>
                <h4 className="text-base md:text-2xl font-body font-[100] text-center lg:text-left text-neutral-200">
                    <span className="hidden md:block">
                        Pengalaman belajar yang berbeda.
                    </span>
                    <span className="block md:hidden">
                        Akses materi belajar yang lengkap dan video belajar yang
                        gak ngebosenin{' '}
                    </span>
                </h4>
                <div className="flex flex-col gap-2 mt-8 md:flex-row md:mt-0">
                    <Link href={'/registrasi'}>
                        <Button variant="primary" className="z-10 md:my-4">
                            Gabung Sekarang
                        </Button>
                    </Link>
                    <Button
                        variant="primary"
                        className="bg-[#212121] md:my-4 z-10 text-center"
                        href="https://discord.gg/qU3SB6wxzY">
                        Gabung Komunitas
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default Hero;
