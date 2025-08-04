import useElementSize from 'commons/hooks/useElementSize';
import AstronotesNavigation from 'courses/components/LearningExperience/AstroNotes/Navigation/AstronotesNavigation';
import AstronotesSidebar from 'courses/components/LearningExperience/AstroNotes/Sidebar/AstronotesSidebar';
import AstroNotesContent from 'courses/components/LearningExperience/AstroNotes/AstroNotesContent';
import { AstronotesProvider } from 'courses/contexts/AstronotesProvider';
import RatingModal from 'courses/components/LearningExperience/AstroNotes/Sidebar/RatingModal';
import FeedbackModal from 'courses/components/LearningExperience/AstroNotes/Sidebar/FeedbackModal';
import CopilotDrawer from 'copilot/assets/CopilotDrawer';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import { useRouter } from 'next/router';
import RelatedBooksSection from 'courses/components/LearningExperience/AstroNotes/InternalLinking/RelatedBooksSection';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { useGetBookRecommendationsQuery } from 'courses/redux/api/learningExperienceApi';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { useGetAstronotesExercisesQuery } from 'exercises/redux/api/exercisesApi';
import AstronotesExercisesSection from 'exercises/components/Astronotes/AstronotesExercisesSection';
import CopilotEntrypoint from 'copilot/components/CopilotEntrypoint';

const Astronotes = ({
    content,
    book,
    recommendations: initialRecommendations,
    onCopilotClick
}: {
    content: string;
    book: BookDetailInterface;
    recommendations: GetBookRecommendationResponse;
    onCopilotClick: (pageId?: string) => void;
}): JSX.Element => {
    const { isMobileBreakpoints } = useWindowBreakpoints();
    const isAuthenticated = useSelector(getIsAuthenticated);

    const { width: notebookWidth, ref: notebookRef } =
        useElementSize<HTMLDivElement>();
    const router = useRouter();
    const { slug, page } = router.query as { slug: string; page: string };
    const {
        data: hydratedRecommendations,
        isLoading: isLoadingRecommendations
    } = useGetBookRecommendationsQuery(
        {
            slug,
            category: 'astronotes'
        },
        {
            skip: !isAuthenticated || !slug,
            refetchOnMountOrArgChange: true
        }
    );
    const recommendations = hydratedRecommendations || initialRecommendations;

    const { data: exercisesData, isLoading: isLoadingExercises } =
        useGetAstronotesExercisesQuery(
            { bookSlug: slug, pageNumber: page },
            { skip: !slug || !page }
        );

    const handleCopilotClick = () => {
        const pageId = exercisesData?.page_id;
        onCopilotClick(pageId);
    };

    return (
        <AstronotesProvider>
            <section className="relative flex flex-col px-4 pt-4 text-black bg-white sm:pb-4 md:flex-row md:gap-2 dark:bg-black dark:text-white">
                {/* TODO(angga): removed until higher in priority

                {highlighted && (
                    <AstronotesContextMenu
                        points={points}
                        setHighlighted={setHighlighted}
                        transform={`translateX(${points.width / 2 - 92}px)`}>
                        <HighlightContextMenu
                            dataHighlighted={
                                dataHighlighted as DataHighlightedInterface
                            }
                            setHighlighted={setHighlighted}
                        />
                    </AstronotesContextMenu>
                )}
                {removeHighlighted && (
                    <AstronotesContextMenu
                        points={points}
                        setHighlighted={setRemoveHighlighted}
                        transform={`translateY(-30px)`}>
                        <RemoveHighlightContextMenu
                            points={points}
                            setRemoveHighlighted={setRemoveHighlighted}
                            highlightId={highlightId}
                            setHighlightId={setHighlightId}
                        />
                    </AstronotesContextMenu>
                )} */}
                <aside className="items-stretch h-[calc(100vh_-_6rem)] hidden gap-2 sticky top-20 md:flex z-[2]">
                    <AstronotesSidebar />
                </aside>
                <div
                    className="relative grid items-center w-full min-h-screen grid-cols-1 mt-5 lg:pb-12"
                    ref={notebookRef}>
                    <div className="w-full max-w-5xl mx-auto sm:px-4">
                        <Breadcrumb
                            nextItem={
                                {
                                    name: book.title,
                                    url: `/perpustakaan/astronotes/${slug}`,
                                    nextItem: {
                                        name: `Halaman ${page}`
                                    }
                                } as BreadcrumbItemProps
                            }
                        />
                        <AstroNotesContent content={content} book={book} />
                        <CopilotEntrypoint onClick={handleCopilotClick} />
                    </div>
                    <div className="flex flex-col w-full pt-8 lg:py-8 lg:max-w-5xl xl:max-w-screen-2xl lg:mx-auto lg:gap-8">
                        <AstronotesExercisesSection
                            exercises={exercisesData?.exercises || []}
                            isLoading={isLoadingExercises}
                        />
                        <RelatedBooksSection
                            orientation={
                                isMobileBreakpoints ? 'vertical' : 'horizontal'
                            }
                            title="Astronotes Terkait"
                            isLoading={isLoadingRecommendations}
                            books={recommendations?.related_books}
                        />
                        <RelatedBooksSection
                            orientation={
                                isMobileBreakpoints ? 'vertical' : 'horizontal'
                            }
                            title="Eksplor Astronotes Lainnya"
                            isLoading={isLoadingRecommendations}
                            books={recommendations?.other_books}
                        />
                    </div>
                </div>
                <CopilotDrawer onCopilotClick={handleCopilotClick} />
                <div
                    className="fixed inset-x-0 bottom-0 px-4 pt-2 pb-4 bg-white md:pb-6 md:pt-4 md:left-auto md:right-0 dark:bg-black"
                    style={{ minWidth: notebookWidth }}>
                    <AstronotesNavigation />
                </div>
                <RatingModal />
                <FeedbackModal />
            </section>
        </AstronotesProvider>
    );
};

export default Astronotes;