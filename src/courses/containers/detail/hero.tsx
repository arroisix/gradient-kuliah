// import { useAuth } from 'src/authentication/contexts/AuthProvider';
// import Button from 'src/commons/components/elements/Button';

import useWindowSize from 'src/commons/hooks/useWindowSize';

const Hero = ({ course }: { course: Course }): JSX.Element => {
    // const { setModalAuthOpen, isAuthenticated } = useAuth();
    const { width } = useWindowSize();
    return (
        <section
            className="h-screen w-full px-4 md:px-[7.5rem] py-4 flex flex-col justify-end md:justify-center mb-16 md:mb-32 relative"
            style={
                width > 768
                    ? {
                          background: `url(${course.banner})`,
                          backgroundSize: 'cover',
                          backgroundPositionX: '80%'
                      }
                    : {}
            }>
            <div
                className="absolute md:hidden top-0 left-0 w-full h-3/4 flex justify-end"
                style={{
                    backgroundImage: `url(${course.banner})`,
                    backgroundSize: 'cover',
                    backgroundPositionX: '90%',
                    backgroundColor:
                        'linear-gradient(90deg, #000000 0%, rgba(0, 0, 0, 0) 25%)'
                }}>
                <div className="h-full w-full relative">
                    <div
                        className="absolute -bottom-5 -left-5 w-full h-10 bg-red-500"
                        style={{ filter: 'blur(4px)' }}></div>
                </div>
            </div>
            <div className="z-10 pb-12">
                <h1 className="text-4xl md:text-5xl font-bold">
                    {course.courseName}
                </h1>
                <div className="w-full md:w-1/2 my-4">
                    <p>{course.shortDescription}</p>
                </div>
            </div>
            {/* {!course.isSubscribed && (
                <div className="flex mt-4">
                    {isAuthenticated() ? (
                        <Button
                            variant="primary"
                            href={`/langganan?courseId=${course.uuid}`}>
                            Gabung Kelas
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={() => setModalAuthOpen(1)}>
                            Gabung Kelas
                        </Button>
                    )}
                </div>
            )} */}
        </section>
    );
};

export default Hero;
