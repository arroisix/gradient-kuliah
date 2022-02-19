import { useAuth } from 'src/authentication/contexts/AuthProvider';
import Button from 'src/commons/components/elements/Button';

const Hero = ({ course }: { course: Course }): JSX.Element => {
    const { setModalAuthOpen, isAuthenticated } = useAuth();
    return (
        <section
            className="h-screen w-full px-[7.5rem] py-4 flex flex-col justify-center mb-32"
            style={{
                background: `url(${course.banner})`,
                backgroundSize: 'cover'
            }}>
            <h1 className="text-[3rem] font-bold">{course.courseName}</h1>
            <div className="w-1/2">
                <p>{course.shortDescription}</p>
            </div>
            {!course.isSubscribed && (
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
            )}
        </section>
    );
};

export default Hero;
