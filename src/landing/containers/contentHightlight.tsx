import Gallery from 'src/commons/components/modules/Gallery';
import useWindowSize from 'src/commons/hooks/useWindowSize';

const Item = (): JSX.Element => {
    return (
        <div
            className="p-4 h-32 w-48 md:h-52 md:w-[24rem] bg-neutral-800 mr-2 rounded-lg cursor-pointer flex items-end"
            style={{
                backgroundColor: '#333333',
                backgroundSize: 'cover'
            }}
            aria-hidden={true}></div>
    );
};

const ContentHighlight = (): JSX.Element => {
    const { width } = useWindowSize();

    return (
        <section className="py-4 relative md:mb-48">
            <div className="px-4 md:px-[7.25rem]">
                <h1 className="font-bold text-2xl">Materi Belajar Lengkap</h1>
                <span className="text-neutral-200">
                    Gabung ke kelas dengan pengajar kualitas terbaik dan materi
                    terlengkap
                </span>
            </div>
            <Gallery
                itemCount={4}
                itemWidth={width > 768 ? 24 : 12}
                row={1}
                items={[1, 2, 3, 4].map((i) => (
                    <Item key={i} />
                ))}
            />
        </section>
    );
};

export default ContentHighlight;
