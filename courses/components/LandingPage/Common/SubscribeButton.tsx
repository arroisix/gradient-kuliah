import { useAuth } from 'authentication/contexts/AuthProvider';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import Button from 'commons/components/elements/Button';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';
import { useSelector } from 'react-redux';

const SubscribeButton = ({
    slug,
    label = 'Akses Sekarang'
}: {
    slug: string;
    label?: string;
}): JSX.Element => {
    const { data: course } = useGetLandingCourseDataQuery(slug, {
        skip: slug === undefined || slug == null
    });
    const { is_subscribed } = useCourseSubscription(slug);
    const { setModalAuthOpen } = useAuth();
    const isAuthenticated = useSelector(getIsAuthenticated);

    return (
        <>
            {isAuthenticated && !is_subscribed && (
                <Button
                    className="md:w-fit text-center my-2 z-[5]"
                    variant="primary"
                    href={`/langganan?courseId=${course?.course_id}`}>
                    Akses Sekarang
                </Button>
            )}
            {!isAuthenticated && !is_subscribed && (
                <Button
                    className="md:w-fit text-center my-2 z-[5]"
                    variant="primary"
                    onClick={() =>
                        setModalAuthOpen(
                            1,
                            false,
                            `/langganan?courseId=${course?.course_id}`
                        )
                    }>
                    {label}
                </Button>
            )}
        </>
    );
};

export default SubscribeButton;
