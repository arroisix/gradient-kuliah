import Gallery from 'src/commons/components/modules/Gallery';
import useWindowSize from 'src/commons/hooks/useWindowSize';

const Item = ({
    thumbnail,
    title
}: {
    thumbnail: string;
    title: string;
}): JSX.Element => {
    return (
        <div
            className="p-4 h-40 w-[18rem] md:h-52 md:w-[24rem] bg-neutral-800 mr-2 rounded-lg cursor-pointer flex items-end"
            style={{
                backgroundColor: '#333333',
                backgroundSize: 'cover',
                backgroundImage: `url(https://d2uqn6ndx4ow3t.cloudfront.net/assets/${thumbnail})`
            }}
            aria-hidden={true}>
            {title}
        </div>
    );
};

const CONTENT = [
    {
        thumbnail: 'thumb-2.jpg',
        title: 'Introduksi: Awakening Moment'
    },
    {
        thumbnail: 'thumb-1.jpg',
        title: 'Pedang Bermata Dua: Teknologi'
    },
    {
        thumbnail: 'thumb-3.jpg',
        title: 'Belajar dari Sejarah'
    }
];

const ContentHighlight = (): JSX.Element => {
    const { width } = useWindowSize();

    return (
        <section className="py-4 relative md:mb-16">
            <div className="px-4 md:px-[7.25rem]">
                <h1 className="font-bold text-2xl">Materi Belajar Lengkap</h1>
                <span className="text-neutral-200">
                    Gabung ke kelas dengan pengajar kualitas terbaik dan materi
                    terlengkap
                </span>
            </div>
            <Gallery
                itemCount={3}
                itemWidth={width > 768 ? 24 : 18}
                row={1}
                items={CONTENT.map((content) => (
                    <Item
                        title={content.title}
                        thumbnail={content.thumbnail}
                        key={content.thumbnail}
                    />
                ))}
            />
        </section>
    );
};

export default ContentHighlight;
