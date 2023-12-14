import AnswerSection from 'komunitas/components/AnswerSection';
import RightSidebar from 'komunitas/components/CommunityPost/SimilarQuestionSidebar';
import QuestionCard from 'komunitas/components/QuestionCard';
import { useKomunitas } from 'komunitas/contexts/KomunitasProvider';
import { useState } from 'react';

type DetailSectionProps = {
    initialDetailData: CommunityPostDetailResponse;
};

const DetailSection = ({
    initialDetailData
}: DetailSectionProps): JSX.Element => {
    const [isShowForm, setIsShowForm] = useState(false);

    const { detailQuestion = initialDetailData, subjects } = useKomunitas();

    const category = subjects?.categories.filter(
        (value) => value.name === detailQuestion?.category
    )[0];

    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-[2rem]">
            <div className="flex flex-col w-full lg:col-span-2 gap-9">
                <div>
                    <h3 className="pb-5 text-sm font-bold">Pertanyaan</h3>
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
            <RightSidebar className="lg:col-span-1" category={category} />
        </section>
    );
};

export default DetailSection;
