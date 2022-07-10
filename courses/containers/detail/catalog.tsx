import Container from 'commons/components/elements/Container';
import CatalogContainer from 'courses/components/CatalogContainer';

const Catalog = ({ course }: { course: Course }): JSX.Element => {
    const sortChapterOrder = (): Chapter[] => {
        const rawChapters = [...course.chapters];
        const sortedChapter = rawChapters?.sort(
            (a: Chapter, b: Chapter) => a.order - b.order
        );

        return sortedChapter;
    };

    return (
        <Container>
            <CatalogContainer
                chapters={sortChapterOrder()}
                latest_subchapter={course.learning_progress?.latest_subchapter}
            />
        </Container>
    );
};

export default Catalog;
