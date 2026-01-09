import Image from 'next/image';

function LecturerProfile({
    lecturers
}: {
    lecturers: Lecturer[] | undefined;
}): JSX.Element {
    if (!lecturers || lecturers.length === 0) {
        return <></>;
    }

    const lecturer = lecturers[0];

    return (
        <div className="flex items-center gap-3">
            <Image
                src={lecturer.photo}
                alt={lecturer.name}
                width={44}
                height={44}
                className="rounded-full object-cover object-center"
            />

            <div className="space-y-1">
                <h3 className="text-white font-semibold text-sm">
                    {lecturer.name}
                </h3>

                <p className="text-[#999999] text-xs">{lecturer.role}</p>
            </div>
        </div>
    );
}

export { LecturerProfile };
