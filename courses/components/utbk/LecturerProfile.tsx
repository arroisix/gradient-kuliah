import Image from 'next/image';

type LecturerProfileItem = {
    id?: string;
    name: string;
    photo: string;
    role: string;
};

function LecturerProfile({
    lecturers
}: {
    lecturers: LecturerProfileItem[] | undefined;
}): JSX.Element {
    if (!lecturers || lecturers.length === 0) {
        return <></>;
    }

    return (
        <>
            <div className="flex items-center gap-3 lg:hidden">
                <Image
                    src={lecturers[0].photo}
                    alt={lecturers[0].name}
                    width={44}
                    height={44}
                    className="rounded-full object-cover object-center"
                />

                <div className="space-y-1">
                    <h3 className="text-white font-semibold text-sm">
                        {lecturers[0].name}
                    </h3>

                    <p className="text-[#999999] text-xs">
                        {lecturers[0].role}
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex items-start gap-8 overflow-x-auto no-scrollbar pr-16">
                {lecturers.map((lecturer, index) => (
                    <div
                        key={lecturer.id ?? `${lecturer.name}-${index}`}
                        className="flex items-center gap-3 min-w-fit">
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

                            <p className="text-[#999999] text-xs">
                                {lecturer.role}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export { LecturerProfile };
