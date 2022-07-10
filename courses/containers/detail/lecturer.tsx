import Image from 'next/image';

const Lecturer = ({ course }: { course: Course }): JSX.Element => {
    return (
        <div className="px-4 md:px-[7.5rem] mb-32">
            <h1 className="md:text-center text-2xl md:text-4xl font-bold">
                Guru spektakuler kelas ini
            </h1>
            <div className="grid grid-cols-2 md:flex md:justify-center md:items-center md:flex-wrap mt-4">
                {course?.lecturers?.map((lecturer) => {
                    return (
                        <div
                            key={lecturer.name}
                            className="flex flex-col justify-center md:mx-4">
                            <div className="flex flex-col justify-center items-center">
                                <div className="w-[140px] md:w-[270px] bg-neutral-900 rounded mb-2 overflow-hidden">
                                    <Image
                                        src={lecturer.photo}
                                        height={400}
                                        width={270}
                                        layout="responsive"
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-center text-neutral-400">
                                    {lecturer.name}
                                </p>
                                <p className="text-center">
                                    {lecturer.role ?? 'Dosen Universitas Dummy'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Lecturer;
