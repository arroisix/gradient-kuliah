const LecturerAvatar = ({ lecturer }: { lecturer: Lecturer }): JSX.Element => {
    return (
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
                    <h5 className="md:text-xl font-bold">{lecturer.role}</h5>
                </div>
            </div>
        </div>
    );
};

export default LecturerAvatar;
