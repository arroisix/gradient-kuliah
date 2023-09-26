import useElementSize from 'commons/hooks/useElementSize';
import AstronotesNavigation from 'courses/components/LearningExperience/AstroNotes/Navigation/AstronotesNavigation';
import AstronotesSidebar from 'courses/components/LearningExperience/AstroNotes/Sidebar/AstronotesSidebar';
import AstroNotesContent from 'courses/components/LearningExperience/AstroNotes/AstroNotesContent';
import { AstronotesProvider } from 'courses/contexts/AstronotesProvider';
import RatingModal from 'courses/components/LearningExperience/AstroNotes/Sidebar/RatingModal';
import FeedbackModal from 'courses/components/LearningExperience/AstroNotes/Sidebar/FeedbackModal';

const Astronotes = (): JSX.Element => {
    const { width: notebookWidth, ref: notebookRef } =
        useElementSize<HTMLDivElement>();

    return (
        <AstronotesProvider>
            <section className="relative flex flex-col px-4 pb-4 text-black bg-white md:flex-row md:gap-2 dark:bg-black dark:text-white">
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
                <aside className="items-stretch h-[calc(100vh_-_6rem)] hidden gap-2 sticky top-20 md:flex">
                    <AstronotesSidebar />
                </aside>
                <div
                    className="w-full min-h-screen pt-20 mt-5 mb-12 md:ml-6 sm:overflow-auto"
                    ref={notebookRef}>
                    <div className="w-full max-w-5xl mx-auto sm:px-4">
                        <AstroNotesContent />
                    </div>
                </div>
                <div
                    className="fixed bottom-0 md:right-[17px] pt-2 pb-6 bg-white dark:bg-black"
                    style={{ width: notebookWidth }}>
                    <AstronotesNavigation />
                </div>
                <RatingModal />
                <FeedbackModal />
            </section>
        </AstronotesProvider>
    );
};

export default Astronotes;
