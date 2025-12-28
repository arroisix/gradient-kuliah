import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import { useGetExerciseDetailV2Query } from 'exercises/redux/api/exercisesApi';
import { ChevronLeft, ChevronRight, XIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ExerciseCompleteHeader = () => {
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

    const isUTBK = exercise?.tryout_type === 'UTBK';
    const thirdTabLabel = isUTBK ? 'Analisa Diri' : 'Leaderboard';
    const thirdTabRoute = isUTBK ? 'analisa-diri' : 'leaderboard';

    const tabs = ['Nilai', 'Pembahasan', thirdTabLabel];
    const [activeTab, setActiveTab] = useState('');
    const { isMobileBreakpoints } = useWindowBreakpoints();

    useEffect(() => {
        if (problemId) {
            setActiveTab('Pembahasan');
        } else if (
            router.pathname.includes('leaderboard') ||
            router.pathname.includes('analisa-diri')
        ) {
            setActiveTab(thirdTabLabel);
        } else {
            setActiveTab('Nilai');
        }
    }, [problemId, router.pathname, thirdTabLabel]);

    const onClose = () => {
        router.push(`/latihan/`);
    };

    const onTabClicked = (
        tab: 'Nilai' | 'Pembahasan' | 'Leaderboard' | 'Analisa Diri'
    ) => {
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
            case 'Analisa Diri':
                router.push(
                    `/latihan/${slug}/report/${
                        exerciseProgressId ??
                        exercise?.latest_exercise_progress?.id
                    }/${thirdTabRoute}/`,
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
                    className="w-8 h-8 border md:border-none border-violet-4 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center transition-colors text-white disabled:text-white/30 disabled:cursor-not-allowed"
                    onClick={() => {
                        const currentIndex = tabs.indexOf(activeTab);
                        if (currentIndex > 0) {
                            const newTab = tabs[currentIndex - 1];
                            setActiveTab(newTab);
                            onTabClicked(
                                newTab as
                                    | 'Nilai'
                                    | 'Pembahasan'
                                    | 'Leaderboard'
                                    | 'Analisa Diri'
                            );
                        }
                    }}>
                    <ChevronLeft size={isMobileBreakpoints ? 14 : 20} />
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
                                        | 'Analisa Diri'
                                );
                            }}
                            className={cn(
                                'px-6 py-2 rounded-full text-sm transition-all',
                                activeTab === tab
                                    ? 'md:bg-graphite-800 text-white font-semibold'
                                    : 'text-white/60 hover:text-white/80 md:block hidden'
                            )}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Right Arrow Button */}
                <button
                    disabled={activeTab === tabs[tabs.length - 1]}
                    className="w-8 h-8 border md:border-none border-violet-4  rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center transition-colors text-white disabled:text-white/30 disabled:cursor-not-allowed"
                    onClick={() => {
                        const currentIndex = tabs.indexOf(activeTab);
                        if (currentIndex < tabs.length - 1) {
                            const newTab = tabs[currentIndex + 1];
                            onTabClicked(
                                newTab as
                                    | 'Nilai'
                                    | 'Pembahasan'
                                    | 'Leaderboard'
                                    | 'Analisa Diri'
                            );
                        }
                    }}>
                    <ChevronRight size={isMobileBreakpoints ? 14 : 20} />
                </button>
            </div>
        </header>
    );
};

export default ExerciseCompleteHeader;
