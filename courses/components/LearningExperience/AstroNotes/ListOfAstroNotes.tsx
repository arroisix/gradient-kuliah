import usePublicCourseNotebook from 'courses/hooks/usePublicCourseNotebook';
import { getAllNotebookChapter } from 'courses/utils';
import { useRouter } from 'next/router';
import AstroNotesItem from './AstroNotesItem';

const ListOfAstroNotes = ({
    extraCallback
}: {
    extraCallback?: () => void;
}): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { data } = usePublicCourseNotebook(id as string);
    const notebook = getAllNotebookChapter(data?.chapters as Chapter[]);

    return (
        <div className="w-full bg-white py-8 px-1 text-black">
            {notebook?.map((astro: Chapter) => (
                <AstroNotesItem
                    astro={astro}
                    key={astro.id}
                    extraCallback={extraCallback}
                />
            ))}
        </div>
    );
};

export default ListOfAstroNotes;
