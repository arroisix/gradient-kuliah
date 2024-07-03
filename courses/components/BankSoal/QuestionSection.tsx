import Skeleton from 'commons/components/elements/Skeleton';
import React from 'react';
import TiptapViewer from '../Textbook/TiptapViewer';

export const QuestionSection = ({
    problem,
    isLoading
}: Partial<Pick<BankSoal, 'problem'>> & {
    isLoading?: boolean;
}): JSX.Element => {
    if (isLoading)
        return <Skeleton repeat={3} isCustomSize className="w-full h-4 mb-2" />;

    if (!problem?.question.question) return <></>;

    return (
        <>
            {problem.question?.supporting_text && (
                <TiptapViewer content={problem.question.supporting_text} />
            )}
            <TiptapViewer content={problem.question.question} />
        </>
    );
};
