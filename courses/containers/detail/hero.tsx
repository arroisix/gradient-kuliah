import Button from 'commons/components/elements/Button';

const Hero = ({ course }: { course: Course }): JSX.Element => {
    return (
        <section className="h-screen w-full flex flex-col-reverse md:flex-row justify-end md:justify-center relative">
            <div className="w-full h-screen flex flex-col justify-end md:justify-center pl-4 pr-4 md:pr-0 md:pl-[7.5rem] py-4 z-10 mb-8 md:mb-0">
                {!course?.is_subscribed ? (
                    <>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            {course?.course_name}
                        </h1>
                        <div className="w-full md:w-1/3 my-4">
                            <p>{course?.short_description}</p>
                        </div>
                    </>
                ) : (
                    <div className="max-w-full md:max-w-[30vw]">
                        <h4 className="text-base font-bold md:text-3xl">
                            {course?.course_name}
                        </h4>
                        <div className="h-px bg-neutral-800 my-4" />
                        <p className="text-base text-neutral-400">
                            TERAKHIR DIPELAJARI
                        </p>
                        <h3 className="text-2xl md:text-3xl">
                            {course?.learning_progress?.latest_subchapter
                                ?.subchapter?.subchapter_name ??
                                'Belum ada progress belajar'}
                        </h3>
                    </div>
                )}
                {course.is_subscribed ? (
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
                        href={`/#benefit`}>
                        Info Selengkapnya
                    </Button>
                )}
            </div>
            <div className="hidden md:flex h-screen mt-16 md:mt-0 overflow-hidden absolute top-0 right-0">
                <div>
                    <video
                        autoPlay
                        muted
                        loop
                        className="object-contain h-screen">
                        <source
                            src="https://d2uqn6ndx4ow3t.cloudfront.net/courses/calculus/assets/calculus-teaser.mp4"
                            type="video/mp4"
                        />
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
                        <source
                            src="https://d2uqn6ndx4ow3t.cloudfront.net/courses/calculus/assets/calculus-teaser-mobile.mp4"
                            type="video/mp4"
                        />
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

export default Hero;
