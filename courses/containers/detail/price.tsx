import { useAuth } from 'authentication/contexts/AuthProvider';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import { formatter } from 'courses/utils';
import { useSelector } from 'react-redux';

const Price = ({ course }: { course: Course }): JSX.Element => {
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);

    const calculatePrice = (): string => {
        if (course?.price === null) {
            return 'GRATIS';
        }

        if (course?.discount) {
            if (course?.discount >= 100) {
                return 'GRATIS';
            }

            const calcPrice =
                ((course?.price as number) -
                    (course?.price as number) * (course?.discount / 100)) /
                100;

            return formatter.format(Math.floor(calcPrice) * 100).split(',')[0];
        }

        return formatter.format(course?.price as number).split(',')[0];
    };

    return (
        <div className="px-4 md:px-[7.5rem] flex flex-col justify-center items-center my-8 md:my-16 h-[30vh] md:h-[50vh]">
            <h3 className="font-thin text-2xl md:text-4xl">
                Akses instan Semuanya Sekarang!
            </h3>
            {course?.discount && (
                <p className="font-bold text-xs line-through text-red-400 flex">
                    <h2 className="text-3xl md:text-5xl text-black">-</h2>
                    <h2 className="text-[#999999] text-3xl md:text-5xl">
                        {`${
                            formatter
                                .format(course?.price as number)
                                .split(',')[0]
                        }/bulan`}
                    </h2>
                    <h2 className="text-3xl md:text-5xl text-black">-</h2>
                </p>
            )}
            <div className="flex items-end gap-2 my-2">
                <h3 className="font-bold text-2xl md:text-4xl font-white">
                    {`${calculatePrice()}/bulan`}
                </h3>
                <span className="text-[#7FFDB1] font-bold">
                    ({course.discount}% OFF)
                </span>
            </div>
            {isAuthenticated && !course.is_subscribed && (
                <Button
                    className="md:w-fit text-center"
                    variant="primary"
                    href={`/langganan?courseId=${course.id}`}>
                    Akses Sekarang
                </Button>
            )}
            {!isAuthenticated && !course.is_subscribed && (
                <Button
                    className="md:w-fit text-center"
                    variant="primary"
                    onClick={() => setModalAuthOpen(1)}>
                    Akses Sekarang
                </Button>
            )}
        </div>
    );
};

export default Price;
