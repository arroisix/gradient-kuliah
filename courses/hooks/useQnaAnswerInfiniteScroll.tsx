import {
    learningExperienceApi,
    useLazyListPostAnswerQuery,
    useListPostAnswerQuery
} from 'courses/redux/api/learningExperienceApi';
import { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const useQnaAnswerInfiniteScroll = (
    questionId: string
): BaseInfiniteScrollHook<QnaAnswer> & { hasMore: boolean } => {
    const { data: allAnswerData, isLoading: isAllLoading } =
        useListPostAnswerQuery({
            question_id: questionId,
            page: 1
        });
    const [fetchNext, { isLoading, data, isFetching }] =
        useLazyListPostAnswerQuery();
    const anchor = useRef({} as HTMLDivElement);
    const [hasMore, setHasMore] = useState(false);
    const dispatch = useDispatch();

    const loadMore = (): void => {
        fetchNext({
            question_id: questionId,
            page: allAnswerData?.next_page
        });
    };

    useEffect(() => {
        if (
            allAnswerData &&
            allAnswerData?.count_items > allAnswerData?.data.length
        ) {
            setHasMore(true);
        }

        if (allAnswerData?.next_page === null) {
            setHasMore(false);
        }
    }, [allAnswerData]);

    useEffect(() => {
        if (data) {
            dispatch(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                learningExperienceApi.util.updateQueryData(
                    'listPostAnswer',
                    {
                        question_id: questionId,
                        page: 1
                    },
                    (draft) => {
                        const newListAnswer = [...draft.data, ...data.data];

                        return {
                            ...data,
                            data: newListAnswer
                        };
                    }
                )
            );
        }
    }, [data]);

    return {
        allData: allAnswerData,
        isAllLoading,
        isLoading: isLoading || isFetching,
        anchor,
        loadMore,
        hasMore
    };
};

export default useQnaAnswerInfiniteScroll;
