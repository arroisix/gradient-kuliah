import useOnScreen from 'commons/hooks/useOnScreen';
import { useLearning } from 'courses/contexts/LearningProvider';
import {
    learningExperienceApi,
    useLazyListPostQuestionQuery,
    useListPostQuestionQuery
} from 'courses/redux/api/learningExperienceApi';
import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useQnaQuestionInfiniteScroll =
    (): BaseInfiniteScrollHook<QnaQuestion> => {
        const { video } = useLearning();
        const { data: allQuestionData, isLoading: isAllLoading } =
            useListPostQuestionQuery(
                {
                    video_id: video?.id,
                    page: 1
                },
                { skip: !video }
            );
        const [fetchNext, { isLoading, data, isFetching }] =
            useLazyListPostQuestionQuery();
        const anchor = useRef({} as HTMLDivElement);
        const isAnchorOnScreen = useOnScreen(anchor);
        const dispatch = useDispatch();

        const loadMore = (): void => {
            fetchNext({
                video_id: video.id,
                page: allQuestionData?.next_page
            });
        };

        useEffect(() => {
            if (
                (allQuestionData?.data as QnaQuestion[])?.length > 0 &&
                isAnchorOnScreen &&
                !isLoading &&
                allQuestionData?.next_page !== null
            ) {
                loadMore();
            }
        }, [isAnchorOnScreen]);

        useEffect(() => {
            if (data) {
                dispatch(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    learningExperienceApi.util.updateQueryData(
                        'listPostQuestion',
                        {
                            video_id: video.id,
                            page: 1
                        },
                        (draft) => {
                            const newListQuestion = [
                                ...draft.data,
                                ...data.data
                            ];

                            return {
                                ...data,
                                data: newListQuestion.filter(
                                    (v, i, a) =>
                                        a.findIndex((v2) => v2.id === v.id) ===
                                        i
                                )
                            };
                        }
                    )
                );
            }
        }, [data]);

        return {
            allData: allQuestionData,
            isAllLoading,
            isLoading: isLoading || isFetching,
            anchor,
            loadMore
        };
    };

export default useQnaQuestionInfiniteScroll;
