import { useGetLandingCourseDataQuery } from 'courses/redux/api/publicCourseApi';

const CourseDescription = ({
    slug
}: GradientBaseComponentWithSlug): JSX.Element => {
    const { data } = useGetLandingCourseDataQuery(slug);

    return (
        <div className="px-5 w-screen lg:w-3/12">
            <div className="bg-zinc-900 p-4 rounded-xl flex flex-col gap-2">
                <h1 className="font-semibold text-gray-500">
                    Tentang Kelas Ini
                </h1>
                <div className="h-px bg-gray-500 w-full" />
                <div className="text-sm">{data?.description}</div>

                <div className="text-sm text-gray-500">PENGAJAR</div>
                <div className="flex flex-col gap-2">
                    {data?.lecturers.map((lecturer: Lecturer) => (
                        <div
                            className="flex gap-2 items-center"
                            key={lecturer.name}>
                            <div>
                                <div className="h-11 w-11 bg-neutral-200 rounded-full overflow-hidden flex justify-center items-center">
                                    <img
                                        src={lecturer.photo}
                                        className="object-contain object-bottom w-[80%]"
                                        alt="lecturer"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col text-sm">
                                <p>{lecturer.name}</p>
                                <p className="font-semibold">{lecturer.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseDescription;
