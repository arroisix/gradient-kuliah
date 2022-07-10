import Gallery from 'commons/components/modules/Gallery';
import useWindowSize from 'commons/hooks/useWindowSize';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ChapterCatalog = ({ chapter }: { chapter: Chapter }): JSX.Element => {
    const { width } = useWindowSize();
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className="w-full flex flex-col gap-4">
            <h4 className="text-2xl md:text-3xl font-bold">
                {chapter.chapter_name}
            </h4>
            <div>
                <Gallery
                    itemCount={chapter.subchapters.length}
                    itemWidth={width > 768 ? 24 : 18}
                    row={1}
                    items={chapter.subchapters.map((subchapter: SubChapter) => (
                        <Link
                            href={`/kelas/${id}/belajar?type=video&sub=${subchapter.id}&chapter=${chapter.id}`}
                            key={subchapter.id}>
                            <div
                                className="p-4 h-40 w-[18rem] md:h-52 md:w-[24rem] bg-neutral-800 mr-2 rounded-lg cursor-pointer flex items-end"
                                style={{
                                    backgroundColor: '#333333',
                                    backgroundSize: 'cover',
                                    backgroundImage: `url(${subchapter.thumbnail})`
                                }}
                                aria-hidden={true}>
                                <p className="text-base md:text-2xl">
                                    {subchapter.subchapter_name}
                                </p>
                            </div>
                        </Link>
                    ))}
                />
            </div>
        </div>
    );
};

const CatalogContainer = ({
    chapters
}: {
    chapters: Chapter[];
}): JSX.Element => {
    return (
        <div className="flex w-full gap-4 flex-col" id="learning-catalog">
            {chapters.map((chapter: Chapter) => (
                <ChapterCatalog chapter={chapter} key={chapter.id} />
            ))}
        </div>
    );
};

export default CatalogContainer;
