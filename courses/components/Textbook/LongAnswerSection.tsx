import React from 'react';
import TiptapViewer from './TiptapViewer';
import { cn } from 'commons/utils';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';

export const LongAnswerSection = ({
    problem,
    isLoading
}: Partial<Pick<TextbookSolution, 'problem'>> & {
    isLoading: boolean;
}): JSX.Element => {
    const tracker = useTracker();
    const { query } = useRouter();
    const { slug } = query as { slug: string };
    if (!problem?.question.solution) return <></>;

    return (
        <label
            className={cn(
                'mb-6 rounded-lg collapse collapse-arrow bg-neutral-800 transition',
                isLoading && '*:opacity-0 animate-pulse'
            )}>
            <input
                type="checkbox"
                disabled={isLoading}
                onChange={(e) => {
                    if (e.target.checked)
                        tracker?.genericTrack(
                            'User Click Solution of Question',
                            {
                                'Book Slug': slug,
                                'Question ID': problem.id
                            }
                        );
                }}
                name="pembahasan"
                className="!min-h-0"
            />
            <div className="font-bold collapse-title collapse-arrow">
                Pembahasan
            </div>
            <div className="collapse-content">
                <TiptapViewer content={problem.question.solution} />
            </div>
        </label>
    );
};
