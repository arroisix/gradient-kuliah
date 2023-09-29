import { usePostHighlightMutation } from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import React from 'react';

type HighlightContextMenuProps = {
    setHighlighted: React.Dispatch<React.SetStateAction<boolean>>;
    dataHighlighted: DataHighlightedInterface;
};

const HighlightContextMenu = ({
    setHighlighted,
    dataHighlighted
}: HighlightContextMenuProps): JSX.Element => {
    const router = useRouter();
    const { slug } = router.query;
    const [postHighlight] = usePostHighlightMutation();

    return (
        <div className="flex gap-6 p-4 bg-[#242424] rounded-xl">
            <div
                className="w-5 h-5 rounded-full bg-[#F1BF42] cursor-pointer"
                onClick={() => {
                    postHighlight({
                        ...dataHighlighted,
                        slug: slug as string,
                        color: '#F1BF42'
                    });
                    setHighlighted(false);
                }}
                aria-hidden
            />
            <div
                className="w-5 h-5 rounded-full bg-[#D85140] cursor-pointer"
                onClick={() => {
                    postHighlight({
                        ...dataHighlighted,
                        slug: slug as string,
                        color: '#D85140'
                    });
                    setHighlighted(false);
                }}
                aria-hidden
            />
            <div
                className="w-5 h-5 rounded-full bg-[#58A65C] cursor-pointer"
                onClick={() => {
                    postHighlight({
                        ...dataHighlighted,
                        slug: slug as string,
                        color: '#58A65C'
                    });
                    setHighlighted(false);
                }}
                aria-hidden
            />
            <div
                className="w-5 h-5 rounded-full bg-[#3C89E4] cursor-pointer"
                onClick={() => {
                    postHighlight({
                        ...dataHighlighted,
                        slug: slug as string,
                        color: '#3C89E4'
                    });
                    setHighlighted(false);
                }}
                aria-hidden
            />
        </div>
    );
};

export default HighlightContextMenu;
