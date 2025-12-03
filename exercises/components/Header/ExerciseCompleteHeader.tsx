import { cn } from 'commons/utils';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';
import { ChevronLeft, ChevronRight, XIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ExerciseCompleteHeader = () => {
    const tabs = ['Nilai', 'Pembahasan', 'Leaderboard'];
    const [activeTab, setActiveTab] = useState('');

    const router = useRouter();
    const { slug, exerciseProgressId, problemId } = router.query;
    const { data: exercise } = useGetExerciseDetailV2Query(
        {
            exercise_slug: slug as string,
            // if exerciseProgressId is not defined, then don't pass it
            ...(exerciseProgressId
                ? { exercise_progress_id: exerciseProgressId as string }
                : {})
        },
        {
            skip: !slug
        }
    );

    useEffect(() => {
        if (problemId) {
            setActiveTab('Pembahasan');
        } else if (router.pathname.includes('leaderboard')) {
            setActiveTab('Leaderboard');
        } else {
            setActiveTab('Nilai');
        }
    }, [problemId, router.pathname]);

    const onClose = () => {
        router.push(`/latihan/`);
    };

    const onTabClicked = (tab: 'Nilai' | 'Pembahasan' | 'Leaderboard') => {
        switch (tab) {
            case 'Nilai':
                router.push(
                    `/latihan/${slug}/report/${
                        exerciseProgressId ??
                        exercise?.latest_exercise_progress?.id
                    }/`,
                    undefined,
                    { scroll: false, shallow: true }
                );
                break;
            case 'Pembahasan':
                // TODO
                router.push(
                    `/latihan/${slug}/report/${
                        exerciseProgressId ??
                        exercise?.latest_exercise_progress?.id
                    }/${exercise?.first_problemset.id}/${
                        exercise?.first_problemset.first_problem_id
                    }/`,
                    undefined,
                    { scroll: false, shallow: true }
                );
                break;
            case 'Leaderboard':
                router.push(
                    `/latihan/${slug}/report/${
                        exerciseProgressId ??
                        exercise?.latest_exercise_progress?.id
                    }/leaderboard/`,
                    undefined,
                    { scroll: false, shallow: true }
                );
                break;
        }
    };

    return (
        <header className="w-full flex items-center justify-center gap-4 relative">
            <button
                onClick={onClose}
                className="absolute top-auto bottom-auto left-0 cursor-pointer">
                <XIcon size={24} />
            </button>
            <div className="border border-violet-4 rounded-full flex items-center justify-between px-3 py-2 relative gap-4">
                {/* Left Arrow Button */}
                <button
                    disabled={activeTab === tabs[0]}
                    className="w-8 h-8 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center transition-colors text-white disabled:text-white/30 disabled:cursor-not-allowed"
                    onClick={() => {
                        const currentIndex = tabs.indexOf(activeTab);
                        if (currentIndex > 0) {
                            const newTab = tabs[currentIndex - 1];
                            setActiveTab(newTab);
                            onTabClicked(
                                newTab as 'Nilai' | 'Pembahasan' | 'Leaderboard'
                            );
                        }
                    }}>
                    <ChevronLeft size={20} />
                </button>

                {/* Tabs - Desktop: show all tabs, Mobile: show only active tab */}
                <div className="flex-1 flex items-center justify-center gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                onTabClicked(
                                    tab as
                                        | 'Nilai'
                                        | 'Pembahasan'
                                        | 'Leaderboard'
                                );
                            }}
                            className={cn(
                                'px-6 py-2 rounded-full text-sm transition-all',
                                activeTab === tab
                                    ? 'bg-graphite-800 text-white font-semibold'
                                    : 'text-white/60 hover:text-white/80 md:block hidden'
                            )}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Right Arrow Button */}
                <button
                    disabled={activeTab === tabs[tabs.length - 1]}
                    className="w-8 h-8 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center transition-colors text-white disabled:text-white/30 disabled:cursor-not-allowed"
                    onClick={() => {
                        const currentIndex = tabs.indexOf(activeTab);
                        if (currentIndex < tabs.length - 1) {
                            const newTab = tabs[currentIndex + 1];
                            setActiveTab(newTab);
                            onTabClicked(
                                newTab as 'Nilai' | 'Pembahasan' | 'Leaderboard'
                            );
                        }
                    }}>
                    <ChevronRight size={20} />
                </button>
            </div>
        </header>
    );
};

export default ExerciseCompleteHeader;
