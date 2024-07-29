import Breadcrumb from 'commons/components/modules/Breadcrumb';
import AnswerSection from 'komunitas/components/AnswerSection';
import SimilarQuestionSection from 'komunitas/components/CommunityPost/SimilarQuestionSection';
import QuestionCard from 'komunitas/components/QuestionCard';
import { useKomunitas } from 'komunitas/contexts/KomunitasProvider';
import { useState } from 'react';

type DetailSectionProps = {
    initialDetailData: CommunityPostDetailResponse;
    recommendations: GetCommunityPostRecommendationResponse;
};

const DetailSection = ({
    initialDetailData,
    recommendations
}: DetailSectionProps): JSX.Element => {
    const QUESTION_TITLE_MAX_LENGTH = 40;
    const [isShowForm, setIsShowForm] = useState(false);

    const { detailQuestion = initialDetailData, subjects } = useKomunitas();

    const category = subjects?.categories.filter(
        (value) => value.name === detailQuestion?.category
    )[0];
    const questionTitle =
        detailQuestion?.content.length > QUESTION_TITLE_MAX_LENGTH
            ? `${detailQuestion?.content.substring(
                  0,
                  QUESTION_TITLE_MAX_LENGTH
              )} ...`
            : detailQuestion?.content;

    return (
        <>
            <Breadcrumb
                className="w-full py-5"
                nextItem={
                    {
                        name: category?.name,
                        url: `/komunitas/${category?.slug}`,
                        nextItem: {
                            name: questionTitle
                        }
                    } as BreadcrumbItemProps
                }
            />
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="flex flex-col w-full lg:col-span-2 gap-9">
                    <div>
                        <h2 className="pb-5 text-sm font-bold">Pertanyaan</h2>
                        <QuestionCard
                            {...(detailQuestion as CommunityPostDetailResponse)}
                            category={category?.id as string}
                            clickable={false}
                            isShowForm={isShowForm}
                            setIsShowForm={setIsShowForm}
                        />
                    </div>
                    <AnswerSection
                        category={category}
                        setIsShowForm={setIsShowForm}
                    />
                </div>
                <SimilarQuestionSection
                    className="lg:col-span-1"
                    title="Pertanyaan Terkait"
                    questions={recommendations?.related_questions}
                />
            </section>
            <SimilarQuestionSection
                orientation="horizontal"
                title={`Pertanyaan Terpopuler untuk '${category?.name}'`}
                questions={recommendations?.popular_questions}
                className="-mb-8 md:mb-0 md:mt-4"
            />
        </>
    );
};

export default DetailSection;
