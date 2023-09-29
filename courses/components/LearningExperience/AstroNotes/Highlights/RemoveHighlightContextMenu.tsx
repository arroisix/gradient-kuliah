import { useDeleteHighlightMutation } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React from 'react';
import { AiFillDelete } from 'react-icons/ai';

type RemoveHighlightContextMenuProps = {
    setRemoveHighlighted: React.Dispatch<React.SetStateAction<boolean>>;
    highlightId: string;
    setHighlightId: React.Dispatch<string>;
    points: { x: number; y: number; width: number };
};

const RemoveHighlightContextMenu = ({
    setRemoveHighlighted,
    highlightId,
    setHighlightId,
    points
}: RemoveHighlightContextMenuProps): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;

    const [deleteHighlight] = useDeleteHighlightMutation();

    function handleDeleteHighlight(): void {
        deleteHighlight({ slug: slug as string, highlight_id: highlightId });
        setHighlightId('');
        setRemoveHighlighted(false);
    }

    return (
        <div
            className="pt-[30px] flex justify-center"
            style={{ width: `${points.width}px` }}
            onMouseLeave={() => setRemoveHighlighted(false)}>
            <div className="w-max flex items-center py-3 px-4 bg-neutral-200 dark:bg-[#242424] rounded-xl">
                <AiFillDelete
                    className="mr-3 hover:text-error cursor-pointer"
                    onClick={handleDeleteHighlight}
                />
                <span className="inline-block text-xs border-l border-black dark:border-white pl-3 whitespace-nowrap">
                    You highlighted
                </span>
            </div>
        </div>
    );
};

export default RemoveHighlightContextMenu;
