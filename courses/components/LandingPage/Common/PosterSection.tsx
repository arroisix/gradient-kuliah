interface PosterSectionProps {
    slug: string;
    poster?: string;
    label?: string;
}

const PosterSection = ({
    slug,
    poster,
    label
}: PosterSectionProps): JSX.Element => {
    return (
        <div
            className="relative px-4 md:px-[7.5rem] my-16 h-[80vh] flex items-center justify-center gap-4 flex-col md:flex-row overflow-x-hidden"
            style={{
                background:
                    'linear-gradient(199.59deg, rgba(0, 0, 0, 0.1) 17.05%, rgba(22, 12, 44, 0.82) 48.59%, rgba(22, 12, 44, 0) 84.61%)'
            }}>
            <div className="w-full md:h-full flex items-center justify-center">
                <img
                    alt={`poster-${slug}`}
                    src={poster}
                    style={{
                        mixBlendMode: 'lighten'
                    }}
                />
            </div>
            <div className="w-full flex items-center justify-center z-[2]">
                <h2 className="text-xl lg:text-5xl font-bold">{label}</h2>
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
                className="w-[250px] h-[250px] rounded-full absolute -right-64 lg:right-96"
                style={{
                    background:
                        'linear-gradient(49.01deg, #970D00 17.94%, #030C14 86.52%)',
                    filter: 'blur(50px)'
                }}
            />
        </div>
    );
};

export default PosterSection;
