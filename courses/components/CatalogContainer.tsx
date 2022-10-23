import ComingSoon from 'commons/components/elements/Icons/ComingSoon';
import GreenCheck from 'commons/components/elements/Icons/GreenCheck';
import Gallery from 'commons/components/modules/Gallery';
import useWindowSize from 'commons/hooks/useWindowSize';
import { sortByOrder } from 'courses/utils';
import Link from 'next/link';

const ContentCard = ({
    subchapter,
    chapterId,
    isLatest
}: {
    subchapter: SubChapter;
    chapterId: string;
    isLatest: boolean;
}): JSX.Element => {
    return (
        <Link
            href={`/kelas/kalkulus1/belajar/video/${chapterId}/${subchapter.id}`}
            key={subchapter.id}>
            <div
                className={`p-4 h-40 w-[18rem] md:h-52 md:w-[24rem] bg-neutral-800 mr-2 rounded-lg cursor-pointer flex justify-end flex-col ${
                    isLatest && 'border-2 border-accent-purple'
                }`}
                style={{
                    backgroundColor: '#333333',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${subchapter.thumbnail})`
                }}
                aria-hidden={true}>
                <div className="flex w-full items-center">
                    <p className="text-base md:text-2xl mr-2">
                        {subchapter.subchapter_name}
                    </p>
                    {subchapter.video?.progress?.is_finished && (
                        <div className="h-5 w-5">
                            <GreenCheck />
                        </div>
                    )}
                </div>
                {isLatest && (
                    <div>
                        <p className="text-base text-neutral-400">
                            TERAKHIR DIPELAJARI
                        </p>
                    </div>
                )}
            </div>
        </Link>
    );
};

const ChapterCatalog = ({
    chapter,
    latest_subchapter
}: {
    chapter: Chapter;
    latest_subchapter?: SubchapterProgress;
}): JSX.Element => {
    const { width } = useWindowSize();

    return (
        <div className="w-full flex flex-col gap-4">
            <h4 className="text-2xl md:text-3xl font-bold">
                {chapter.chapter_name}
            </h4>
            <div>
                {chapter.subchapters && chapter.subchapters.length > 0 ? (
                    <Gallery
                        itemCount={chapter.subchapters.length}
                        itemWidth={width > 768 ? 24 : 18}
                        row={1}
                        items={sortByOrder(chapter.subchapters).map(
                            (subchapter: SubChapter) => (
                                <ContentCard
                                    subchapter={subchapter}
                                    isLatest={
                                        subchapter.id ===
                                        latest_subchapter?.subchapter.id
                                    }
                                    chapterId={chapter.id}
                                    key={subchapter.id}
                                />
                            )
                        )}
                    />
                ) : (
                    <div className="flex gap-2 items-center py-8">
                        <ComingSoon />
                        <span className="font-body text-neutral-400">
                            Segera hadir
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

const CatalogContainer = ({
    chapters,
    latest_subchapter
}: {
    chapters: Chapter[];
    latest_subchapter?: SubchapterProgress;
}): JSX.Element => {
    return (
        <div className="flex w-full gap-4 flex-col" id="learning-catalog">
            {chapters.map((chapter: Chapter) => (
                <ChapterCatalog
                    chapter={chapter}
                    key={chapter.id}
                    latest_subchapter={latest_subchapter}
                />
            ))}
        </div>
    );
};

export default CatalogContainer;
