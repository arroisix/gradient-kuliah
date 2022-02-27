import Gallery from 'src/commons/components/modules/Gallery';

const Item = (): JSX.Element => {
    return (
        <div
            className="p-4 h-52 w-[24rem] bg-neutral-800 mr-2 rounded-lg cursor-pointer flex items-end"
            style={{
                backgroundColor: '#333333',
                backgroundSize: 'cover'
            }}
            aria-hidden={true}></div>
    );
};

const ContentHighlight = (): JSX.Element => {
    return (
        <section className="py-4 relative mb-48">
            <div className="px-[7.25rem]">
                <h1 className="font-bold text-2xl">Materi Belajar Lengkap</h1>
                <span className="text-neutral-200">
                    Gabung ke kelas dengan pengajar kualitas terbaik dan materi
                    terlengkap
                </span>
            </div>
            <Gallery
                itemCount={10}
                itemWidth={24}
                row={2}
                items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <Item key={i} />
                ))}
            />
        </section>
    );
};

export default ContentHighlight;
