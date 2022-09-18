import { useAuth } from 'authentication/contexts/AuthProvider';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useWindowSize from 'commons/hooks/useWindowSize';
import { formatter } from 'courses/utils';
import { useSelector } from 'react-redux';

const Price = ({
    course,
    secondVariant
}: {
    course: Course;
    secondVariant?: boolean;
}): JSX.Element => {
    const { setModalAuthOpen } = useAuth();
    const { width } = useWindowSize();
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
            {secondVariant ? (
                <>
                    <h3 className="font-bold text-2xl md:text-4xl text-center">
                        {width > 768
                            ? 'Jadi Paham Kalkulus bareng Gradient'
                            : '# Jadi Paham Kalkulus bareng Gradient'}
                    </h3>
                    <p className="text-base md:text-xl text-neutral-400 font-body text-center">
                        Gak takut lagi setiap ngeliat ε-δ dan teman temannya
                    </p>
                </>
            ) : (
                <h3 className="font-thin text-2xl md:text-4xl text-center">
                    Akses instan Semuanya Sekarang!
                </h3>
            )}
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
            <div className="flex items-end gap-2">
                <h3 className="font-bold text-2xl md:text-4xl font-white">
                    {`${calculatePrice()}/bulan`}
                </h3>
                <span className="text-[#7FFDB1] font-bold">
                    ({course.discount}% OFF)
                </span>
            </div>
            {isAuthenticated && !course.is_subscribed && (
                <Button
                    className="md:w-fit text-center my-2"
                    variant="primary"
                    href={`/langganan?courseId=${course.id}`}>
                    {secondVariant && width <= 768
                        ? 'Gabung Sekarang'
                        : 'Akses Sekarang'}
                </Button>
            )}
            {!isAuthenticated && !course.is_subscribed && (
                <Button
                    className="md:w-fit text-center my-2"
                    variant="primary"
                    onClick={() => setModalAuthOpen(1)}>
                    {secondVariant && width <= 768
                        ? 'Gabung Sekarang'
                        : 'Akses Sekarang'}
                </Button>
            )}
        </div>
    );
};

export default Price;
