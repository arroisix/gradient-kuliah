import React, { useEffect, useState } from 'react';
import { TableOfContentMenu } from 'courses/components/Textbook/TableOfContentMenu';
import { QuestionMetadata } from 'courses/components/Textbook/QuestionMetadata';
import { ShortAnswerSection } from 'courses/components/Textbook/ShortAnswerSection';
import { LongAnswerSection } from 'courses/components/Textbook/LongAnswerSection';
import { FeedbackCard } from 'courses/components/Textbook/FeedbackCard';
import { PageNavigation } from 'courses/components/Textbook/PageNavigation';
import {
    useGetBookDetailQuery,
    useGetTextbookSolutionQuery
} from 'courses/redux/api/astronotesApi';
import { useRouter } from 'next/router';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';
import TextbookPaywall from './../../../components/Textbook/TextbookPaywall';
import { IS_BOT } from 'commons/constants';
import { getCookieValue } from 'commons/utils';
import Breadcrumb from 'commons/components/modules/Breadcrumb';
import RelatedProblemsSection from 'courses/components/Textbook/RelatedProblemsSection';
import CopilotEntrypoint from 'copilot/components/CopilotEntrypoint';
import CopilotModal from 'copilot/components/CopilotModal';

type TextbookSolutionProps = {
    data?: TextbookSolution;
    recommendations?: GetProblemRecommendationsResponse;
};

const TextbookSolution = ({
    data: initialData,
    recommendations
}: TextbookSolutionProps): JSX.Element => {
    const router = useRouter();
    const [isCrawler, setIsCrawler] = useState<string>();
    const { is_subscribed } = useCourseSubscription();
    const [isCopilotModalOpen, setIsCopilotModalOpen] = useState<boolean>(false);
    const { slug, problemSlug } = router.query as {
        slug: string;
        problemSlug: string;
    };
    const { data: textbookData, isFetching } = useGetTextbookSolutionQuery(
        { slug, problemSlug, specialToken: isCrawler },
        { skip: !slug || !problemSlug }
    );
    const { data: getTextbookDetail } = useGetBookDetailQuery(
        { slug },
        { skip: !slug }
    );
    const data = textbookData ?? initialData;
    useEffect(() => {
        setIsCrawler(getCookieValue(IS_BOT));
    }, []);

    const handleCopilotClick = () => {
        setIsCopilotModalOpen(true);
    };

    return (
        <div className="drawer drawer-end lg:drawer-open">
            <TableOfContentMenu problem={data?.problem} />
            <div className="w-full pt-8 pb-12 mx-auto space-y-4 drawer-content md:max-w-screen-2xl md:px-8 lg:px-12">
                <Breadcrumb
                    nextItem={
                        {
                            name: getTextbookDetail?.book.title,
                            url: `/perpustakaan/textbook/${slug}`,
                            nextItem: {
                                name: data?.problem.title
                            }
                        } as BreadcrumbItemProps
                    }
                />
                <div className="flex items-start justify-between">
                    <QuestionMetadata problem={data?.problem} />
                    <PageNavigation
                        next={data?.next_problem_slug}
                        prev={data?.prev_problem_slug}
                    />
                </div>
                {data?.problem.is_free || is_subscribed || isCrawler ? (
                    <>
                        <ShortAnswerSection
                            problem={data?.problem}
                            isLoading={isFetching}
                        />
                        <LongAnswerSection
                            problem={data?.problem}
                            isLoading={isFetching}
                            isCrawler={!!isCrawler}
                        />
                        <FeedbackCard
                            review={data?.problem.review}
                            isLoading={isFetching}
                        />
                    </>
                ) : (
                    <TextbookPaywall problem={data?.problem} />
                )}
                <CopilotEntrypoint onClick={handleCopilotClick} />
                <RelatedProblemsSection
                    title="Soal Terkait"
                    problems={recommendations?.related_problems}
                />
                <RelatedProblemsSection
                    title="Eksplor Soal Lainnya"
                    problems={recommendations?.other_problems}
                />
            </div>

            <CopilotModal
                isOpen={isCopilotModalOpen}
                setOpen={setIsCopilotModalOpen}
                xlWidth="xl:w-[24rem]"
            />
        </div>
    );
};

export default TextbookSolution;
