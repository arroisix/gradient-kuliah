import useElementSize from 'commons/hooks/useElementSize';
import AstronotesNavigation from 'courses/components/LearningExperience/AstroNotes/Navigation/AstronotesNavigation';
import AstronotesSidebar from 'courses/components/LearningExperience/AstroNotes/Sidebar/AstronotesSidebar';
import AstroNotesContent from 'courses/components/LearningExperience/AstroNotes/AstroNotesContent';
import { AstronotesProvider } from 'courses/contexts/AstronotesProvider';

const Astronotes = (): JSX.Element => {
    const { width: notebookWidth, ref: notebookRef } =
        useElementSize<HTMLDivElement>();

    return (
        <AstronotesProvider>
            <section className="pt-20 pb-4 px-4 flex flex-col md:flex-row md:gap-2 md:items-stretch relative md:overflow-hidden md:h-[100vh] bg-white dark:bg-black text-black dark:text-white">
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
                <AstronotesSidebar />
                <div
                    className="w-full mt-5 mb-12 sm:overflow-y-auto md:ml-6"
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
            </section>
        </AstronotesProvider>
    );
};

export default Astronotes;
