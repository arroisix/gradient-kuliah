import { useAuth } from 'authentication/contexts/AuthProvider';
import Button from 'commons/components/elements/Button';
import useWindowSize from 'commons/hooks/useWindowSize';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { formatter } from 'courses/utils';

const Hero = ({ course }: { course: Course }): JSX.Element => {
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { width } = useWindowSize();

    const calculatePrice = (): string => {
        if (course.price === null) {
            return 'GRATIS';
        }

        if (course.discount) {
            if (course.discount >= 100) {
                return 'GRATIS';
            }

            const calcPrice =
                (course.price as number) -
                (course.price as number) * (course.discount / 100);

            return formatter.format(calcPrice).split(',')[0];
        }

        return formatter.format(course.price as number).split(',')[0];
    };

    return (
        <section
            className="h-screen w-full px-4 md:px-[7.5rem] py-4 flex flex-col justify-end md:justify-center mb-16 md:mb-32 relative"
            style={
                width > 768
                    ? {
                          background: `url(${course?.banner})`,
                          backgroundSize: 'cover',
                          backgroundPositionX: '80%'
                      }
                    : {}
            }>
            <div
                className="absolute md:hidden top-0 left-0 w-full h-3/4 flex justify-end"
                style={{
                    backgroundImage: `url(${course?.banner})`,
                    backgroundSize: 'cover',
                    backgroundPositionX: '90%',
                    backgroundColor:
                        'linear-gradient(90deg, #000000 0%, rgba(0, 0, 0, 0) 25%)'
                }}>
                <div className="h-full w-full relative">
                    <div
                        className="absolute -bottom-5 -left-5 w-full h-10 bg-black"
                        style={{ filter: 'blur(4px)' }}></div>
                </div>
            </div>
            <div className="z-10 pb-6 md:pb-12">
                {!course?.is_subscribed ? (
                    <>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            {course?.course_name}
                        </h1>
                        <div className="w-full md:w-1/2 my-4">
                            <p>{course?.short_description}</p>
                        </div>
                    </>
                ) : (
                    <div className="max-w-full md:max-w-[40vw]">
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
            </div>
            {!course?.is_subscribed ? (
                <div className="flex mb-4 md:mt-2 md:mb-0">
                    {isAuthenticated ? (
                        <div className="flex flex-col-reverse gap-2 lg:justify-start justify-center items-center lg:flex-row w-full">
                            <Button
                                className="w-full md:w-fit text-center"
                                variant="primary"
                                href={`/langganan?courseId=${course?.id}`}>
                                Gabung Kelas
                            </Button>
                            <div>
                                {course.discount && (
                                    <p className="font-bold text-xs text-[#353535] line-through">
                                        {`${
                                            formatter
                                                .format(course.price as number)
                                                .split(',')[0]
                                        }/bulan`}
                                    </p>
                                )}
                                <p className="font-bold text-2xl font-white">
                                    {`${calculatePrice()}/bulan`}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col-reverse gap-2 lg:justify-start justify-center items-center lg:flex-row w-full">
                            <Button
                                className="w-full md:w-fit text-center"
                                variant="primary"
                                onClick={() => setModalAuthOpen(1)}>
                                Gabung Kelas
                            </Button>
                            <div>
                                {course.discount && (
                                    <p className="font-bold text-xs text-[#353535] line-through">
                                        {`${
                                            formatter
                                                .format(course.price as number)
                                                .split(',')[0]
                                        }/bulan`}
                                    </p>
                                )}
                                <p className="font-bold text-2xl font-white">
                                    {`${calculatePrice()}/bulan`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex mb-4 md:mt-6 md:mb-0">
                    <Button
                        className="w-full md:w-fit text-center"
                        variant="primary"
                        href={`/kelas/${course?.id}#learning-catalog`}>
                        Lanjut Belajar
                    </Button>
                </div>
            )}
        </section>
    );
};

export default Hero;
