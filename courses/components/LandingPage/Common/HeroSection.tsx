import Button from 'commons/components/elements/Button';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { MdInfoOutline } from 'react-icons/md';

interface HeroCommonProps {
    title?: string;
    tagline?: string;
    video_preview?: string;
    video_preview_mobile?: string;
    slug: string;
}

const HeroSection = ({
    title,
    tagline,
    video_preview,
    video_preview_mobile,
    slug
}: HeroCommonProps): JSX.Element => {
    const { is_subscribed, expiryDay, latest_subchapter } =
        useCourseSubscription(slug);

    return (
        <section className="h-screen w-full flex flex-col-reverse md:flex-row justify-end md:justify-center relative">
            <div className="w-full h-screen flex flex-col justify-end md:justify-center pl-4 pr-4 md:pr-0 md:pl-[7.5rem] py-4 z-10 mb-8 md:mb-0">
                {!is_subscribed ? (
                    <>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            {title}
                        </h1>
                        <div className="w-full md:w-1/3 my-4">
                            <p>{tagline}</p>
                        </div>
                    </>
                ) : (
                    <div className="max-w-full md:max-w-[30vw]">
                        <h4 className="text-base font-bold md:text-3xl">
                            {title}
                        </h4>
                        <div className="h-px bg-neutral-800 my-4" />
                        <p className="text-base text-neutral-400">
                            TERAKHIR DIPELAJARI
                        </p>
                        <h3 className="text-2xl md:text-3xl">
                            {latest_subchapter?.subchapter.subchapter_name ??
                                'Belum ada progress belajar'}
                        </h3>
                    </div>
                )}
                {is_subscribed ? (
                    <Button
                        className="md:w-fit text-center mt-4"
                        variant="primary"
                        href={`/#learning-catalog`}>
                        Lanjut Belajar
                    </Button>
                ) : (
                    <Button
                        className="md:w-fit text-center mt-4"
                        variant="primary"
                        href={`/kelas/${slug}#benefit`}>
                        Info Selengkapnya
                    </Button>
                )}
                {is_subscribed &&
                    (expiryDay <= 7 || new Date() <= new Date('2022-10-14')) &&
                    expiryDay < 30 && (
                        <div className="flex mt-2 items-center gap-2">
                            <MdInfoOutline className="text-xl" />
                            <h4 className="font-body">
                                Waktu berlanggangan kamu akan segera habis dalam{' '}
                                {expiryDay} hari
                            </h4>
                        </div>
                    )}
            </div>
            <div className="hidden md:flex h-screen mt-16 md:mt-0 overflow-hidden absolute top-0 right-0">
                <div>
                    <video
                        autoPlay
                        muted
                        loop
                        className="object-contain h-screen">
                        <source src={video_preview} type="video/mp4" />
                    </video>
                    <div
                        className="h-[105vh] w-[10vw] bg-black absolute -left-32 top-0"
                        style={{ filter: 'blur(4px)' }}
                    />
                </div>
            </div>
            <div className="flex md:hidden h-screen w-screen mt-16 overflow-hidden absolute top-0 left-0">
                <div className="relative">
                    <video
                        autoPlay
                        muted
                        loop
                        className="object-cover w-screen max-h-[80vh]">
                        <source src={video_preview_mobile} type="video/mp4" />
                    </video>
                    <div
                        className="h-[10vh] w-[105vw] bg-black absolute bottom-32 -left-2"
                        style={{ filter: 'blur(4px)' }}
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
