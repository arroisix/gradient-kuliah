const UniqueContent = (): JSX.Element => {
    return (
        <div
            className="px-4 md:px-[7.5rem] py-4 flex flex-col md:flex-row-reverse items-center min-h-[70vh] relative"
            style={{
                background:
                    'linear-gradient(162.05deg, rgba(0, 0, 0, 0.1) 15.89%, rgba(22, 12, 44, 0.82) 50.43%, rgba(22, 12, 44, 0) 89.88%)'
            }}>
            <div className="w-full h-[40vh] md:h-[70vh] flex justify-center">
                <div
                    className="w-full h-full"
                    style={{
                        background:
                            'url(https://d2uqn6ndx4ow3t.cloudfront.net/assets/manim-anim.gif)',
                        mixBlendMode: 'lighten',
                        backgroundColor: 'cover',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}></div>
            </div>
            <div className="w-full flex justify-center z-[5]">
                <div className="w-[240px] md:w-[360px]">
                    <h3 className="text-lg md:text-4xl font-bold text-center md:text-left">
                        Materi yang sama, dengan perspektif yang berbeda.
                    </h3>
                </div>
            </div>
            <div
                className="w-[320px] h-[320px] rounded-full absolute -left-36 bottom-16"
                style={{
                    background:
                        'linear-gradient(49.01deg, #970D00 17.94%, #030C14 86.52%)',
                    filter: 'blur(2px)'
                }}
            />
            <div
                className="w-[102px] h-[102px] rounded-full absolute top-8 right-96"
                style={{
                    background:
                        'linear-gradient(49.01deg, #5F2BCE 16.06%, #000000 71.58%)'
                }}
            />
            <div
                className="w-[77px] h-[77px] rounded-full absolute bottom-32 right-32"
                style={{
                    background:
                        'linear-gradient(49.01deg, #393A3B 4.64%, #030C14 84.65%)',
                    transform: 'matrix(-1, 0, 0, 1, 0, 0)'
                }}
            />
        </div>
    );
};

export default UniqueContent;
