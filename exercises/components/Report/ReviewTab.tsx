import React, { useEffect, useState } from 'react';
import Filter from 'commons/components/elements/Filter';
import { REVIEW_FILTER_OPTIONS } from '../../types/constants';
import { useRouter } from 'next/router';
import { ProblemCard } from './Card/ProblemCard';

const ReviewTab = ({ problems }: { problems: any[] }) => {
    const router = useRouter();
    const { filter: urlFilter } = router.query;
    const [filter, setFilter] = useState((urlFilter as string) || 'all');

    useEffect(() => {
        if (urlFilter) {
            setFilter(urlFilter as string);
        }
    }, [urlFilter]);

    const filteredProblems = problems.filter((problem) => {
        if (filter === 'correct') return problem.user_progress.is_correct;
        if (filter === 'incorrect') return !problem.user_progress.is_correct;
        return true;
    });

    const handleFilterChange = (newFilter: string) => {
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, filter: newFilter }
            },
            undefined,
            { shallow: true }
        );
    };

    return (
        <div className="w-full flex flex-col gap-6 max-w-[640px]">
            <Filter
                options={REVIEW_FILTER_OPTIONS}
                defaultSelected={filter}
                className="w-full"
                onChange={handleFilterChange}
                fullWidth={true}
            />
            {filteredProblems?.map((problem, index) => (
                <ProblemCard
                    key={problem.id}
                    problem={problem}
                    index={index + 1}
                />
            ))}
        </div>
    );
};

export default ReviewTab;
