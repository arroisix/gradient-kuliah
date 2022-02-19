import Image from 'next/image';

const Lecturer = ({ course }: { course: Course }): JSX.Element => {
    return (
        <div className="px-[7.5rem] mb-32">
            <h1 className="text-center text-[2.25rem] font-bold">
                Pengajar kelas ini
            </h1>
            <div className="flex items-center justify-evenly flex-wrap mt-4">
                {course.lecturers.map((lecturer) => {
                    return (
                        <div
                            key={lecturer.name}
                            className="flex flex-col justify-center">
                            <div className="h-[440px] w-[270px] bg-neutral-900 rounded mb-2 overflow-hidden">
                                <Image
                                    src={lecturer.photo}
                                    height={440}
                                    width={270}
                                    layout="responsive"
                                />
                            </div>
                            <span className="text-center text-neutral-400">
                                {lecturer.name}
                            </span>
                            <span className="text-center">
                                {lecturer.role ?? 'Dosen Universitas Dummy'}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Lecturer;
