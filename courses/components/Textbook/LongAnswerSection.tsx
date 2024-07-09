import React, { useEffect, useState } from 'react';
import TiptapViewer from './TiptapViewer';
import { cn } from 'commons/utils';
import { useTracker } from 'tracker/tracker';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { RegistrationSection } from 'authentication/containers/RegistrationSection';

export const LongAnswerSection = ({
    problem,
    isCrawler,
    isLoading
}: Partial<Pick<TextbookSolution, 'problem'>> & {
    isLoading: boolean;
    isCrawler?: boolean;
}): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const tracker = useTracker();
    const { query } = useRouter();
    const { slug } = query as { slug: string };
    const isAuthenticated = useSelector(getIsAuthenticated);

    useEffect(() => {
        if (isOpen) setIsOpen(false);
    }, [problem]);

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
                checked={isOpen}
                onChange={(e) => {
                    setIsOpen(e.target.checked);
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
                {!isCrawler && !isAuthenticated ? (
                    <div className="grid place-items-center">
                        <div className="bg-neutral-900 px-8 py-8 rounded max-w-[450px] shadow-md">
                            <h2 className="mb-4 text-xl font-extrabold leading-relaxed text-center">
                                Buat akun untuk lanjut membaca
                            </h2>
                            <RegistrationSection />
                        </div>
                    </div>
                ) : (
                    <TiptapViewer content={problem.question.solution} />
                )}
            </div>
        </label>
    );
};
