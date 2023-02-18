interface PosterSectionProps {
    slug: string;
    poster?: string;
    label?: string;
    description?: string;
}

const PosterKalkulus1Section = ({
    slug,
    poster,
    label,
    description
}: PosterSectionProps): JSX.Element => {
    return (
        <div
            className="relative p-4 md:px-[7.5rem] my-16 h-[50vh] lg:h-screen flex justify-center items-center gap-4 flex-col"
            style={{
                background:
                    'linear-gradient(199.59deg, rgba(0, 0, 0, 0.1) 17.05%, rgba(22, 12, 44, 0.82) 48.59%, rgba(22, 12, 44, 0) 84.61%)'
            }}>
            <div className="w-full flex flex-col items-center justify-center z-[2] my-4">
                <h2 className="text-xl lg:text-5xl font-bold text-center">
                    {label}
                </h2>
                <span className="text-xs lg:text-lg text-center text-neutral-400">
                    {description}
                </span>
            </div>
            <div className="w-full max-h-[75vh] flex items-center justify-center z-[2]">
                <img alt={`poster-${slug}`} src={poster} className="h-full" />
            </div>
            <div
                className="w-[250px] h-[250px] lg:w-[320px] lg:h-[320px] rounded-full absolute -left-36 bottom-16"
                style={{
                    background:
                        'linear-gradient(49.01deg, #444444 16.06%, #000000 71.58%)',
                    filter: 'blur(5px)'
                }}
            />
            <div
                className="w-[250px] h-[250px] rounded-full absolute right-0"
                style={{
                    background:
                        'linear-gradient(49.01deg, #970D00 17.94%, #030C14 86.52%)',
                    filter: 'blur(50px)'
                }}
            />
        </div>
    );
};

export default PosterKalkulus1Section;
