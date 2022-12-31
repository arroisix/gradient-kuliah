import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetSubchapterDetailQuery } from 'courses/redux/api/privateCourseApi';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const DescriptionSection = (): JSX.Element => {
    const router = useRouter();
    const { sub } = router.query;
    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data } = useGetSubchapterDetailQuery(sub as string, {
        skip: sub === null || sub === undefined || !isAuthenticated
    });
    return (
        <div className="w-full py-4 px-4 md:px-0">
            <p className="text-base font-body text-white">
                {data?.video?.description !== '-'
                    ? data?.video?.description
                    : ''}
            </p>
            <p className="text-neutral-600 my-4">PENGAJAR</p>
            {data?.video?.lecturers?.map((lecturer) => (
                <div
                    className="w-full grid grid-colrs-1 md:grid-cols-2 gap-2"
                    key={lecturer.name}>
                    <div className="flex w-full items-center">
                        <div>
                            <div className="h-16 w-16 bg-neutral-200 rounded-full overflow-hidden flex justify-center items-center">
                                <img
                                    src={lecturer.photo}
                                    height="100%"
                                    alt="lecturer"
                                />
                            </div>
                        </div>
                        <div className="ml-2">
                            <h5 className="md:text-xl text-neutral-200">
                                {lecturer.name}
                            </h5>
                            <h5 className="md:text-xl font-bold">
                                {lecturer.role}
                            </h5>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DescriptionSection;
