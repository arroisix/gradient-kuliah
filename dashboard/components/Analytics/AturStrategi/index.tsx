import { StarsSolidIcon } from 'commons/components/elements/Icons/StarsSolidIcon';
import { useGetAdmissionChanceQuery } from 'dashboard/redux/api/dashboardApi';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Tabs } from 'radix-ui';
import { useEffect, useState } from 'react';
import { PeluangCard } from './PeluangCard';
import { SubtestInput } from './SubtestInput';
import { cn } from 'commons/utils';

function AturStrategi(): JSX.Element {
    const [averageScore, setAverageScore] = useState(0);
    const [problemsetsMap, setProblemsetsMap] =
        useState<Record<string, { course_cover: string; score: string }>>();

    const [selectedTab, setSelectedTab] = useState<
        'nilai_tertinggi' | 'custom'
    >('nilai_tertinggi');

    const { data, isLoading } = useGetAdmissionChanceQuery();

    const handleInputChange = (name: string, value: string) => {
        if (problemsetsMap && value.length < 5) {
            const score = value === '' ? 0 : parseInt(value, 10);
            problemsetsMap[name].score = score.toString();
            if (Number(score) <= 1000 || score === 0) {
                setProblemsetsMap({ ...problemsetsMap });
            }
        }
    };

    const resetCustomScore = () => {
        if (problemsetsMap) {
            for (const [k] of Object.entries(problemsetsMap)) {
                problemsetsMap[k].score = '';
            }
            setProblemsetsMap({ ...problemsetsMap });
        }
    };

    useEffect(() => {
        setProblemsetsMap(
            data?.highest_tryout?.problemsets.reduce(
                (acc: NonNullable<typeof problemsetsMap>, field) => {
                    acc[field.course_name] = {
                        course_cover: field.course_cover,
                        score: ''
                    };

                    return acc;
                },
                {}
            )
        );
    }, [data?.highest_tryout?.problemsets]);

    useEffect(() => {
        if (problemsetsMap) {
            const entries = Object.entries(problemsetsMap);
            const len = entries.length;
            let total_score = 0;
            for (const [_, v] of entries) {
                const score_num = Number(v.score);
                if (score_num) {
                    total_score += score_num;
                }
            }
            const avg_score = total_score / len;
            setAverageScore(Number(avg_score.toFixed(2)));
        }
    }, [problemsetsMap]);

    return (
        <div className="w-full max-w-[934px] mx-auto">
            {/* top bar */}
            <div
                className={cn(
                    'flex justify-between items-center mb-8',
                    'lg:flex-col lg:gap-6 lg:items-start'
                )}>
                <Link
                    href="/utbk/dashboard"
                    className={cn(
                        'bg-[#333333] rounded-full w-8 h-8 flex justify-center items-center',
                        'lg:w-fit lg:h-fit lg:py-2 lg:px-4 lg:gap-1.5'
                    )}>
                    <ChevronLeftIcon className="shrink-0 w-4 h-4 text-white" />
                    <span
                        className={cn(
                            'hidden',
                            'lg:block text-white font-semibold text-sm leading-tight'
                        )}>
                        Kembali
                    </span>
                </Link>

                <h1
                    className={cn(
                        'text-white font-semibold leading-[140%]',
                        'lg:text-2xl lg:font-bold lg:leading-tight'
                    )}>
                    Atur Strategi
                </h1>

                <div className="lg:hidden"></div>
            </div>

            <div
                className={cn(
                    'space-y-6',
                    'lg:space-y-0 lg:grid lg:grid-cols-11 lg:gap-6'
                )}>
                {/* peluang masuk card */}
                {isLoading ? (
                    <div
                        className={cn(
                            'animate-pulse bg-[#333333] rounded-xl w-full max-w-[416px] h-[270px] mx-auto',
                            'lg:col-span-5'
                        )}></div>
                ) : (
                    <PeluangCard
                        tryout_score={
                            selectedTab === 'nilai_tertinggi'
                                ? data?.highest_tryout?.score ?? 0
                                : averageScore
                        }
                        passing_grade={data?.passing_grade ?? 0}
                    />
                )}

                {/* subtest scores */}
                <div
                    className={cn(
                        'bg-[#101010] px-4 py-6 rounded-t-2xl',
                        'lg:col-span-6'
                    )}>
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-white font-semibold leading-[140%]">
                            Input Nilai Materi
                        </h2>

                        <button
                            disabled={selectedTab !== 'custom'}
                            onClick={resetCustomScore}
                            type="button"
                            className="text-[#B6A6F3] font-semibold text-sm leading-tight py-2 px-3 hover:opacity-75 disabled:opacity-75 transition-all">
                            Reset
                        </button>
                    </div>

                    <p className="text-[#9CA3AF] text-sm leading-[160%] inline-block mb-6">
                        Nilai berdasarkan Try Out tertinggimu:{' '}
                        {isLoading ? (
                            <></>
                        ) : (
                            <Link
                                href={`/latihan/${data?.highest_tryout?.exercise_slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline font-semibold">
                                {data?.highest_tryout?.exercise_title}
                            </Link>
                        )}
                    </p>

                    <Tabs.Root
                        value={selectedTab}
                        onValueChange={(v) =>
                            setSelectedTab(v as typeof selectedTab)
                        }>
                        <Tabs.List className="flex items-center gap-2 mb-6">
                            <Tabs.Trigger
                                value="nilai_tertinggi"
                                type="button"
                                className="data-[state=active]:from-[#FFFFFFB2] data-[state=active]:to-[#F2F2F2E5] data-[state=active]:text-black data-[state=active]:border-[#FFFFFF2B] data-[state=inactive]:from-black/10 data-[state=inactive]:to-[#F2F2F21A] data-[state=inactive]:text-white data-[state=inactive]:border-[#FFFFFF2B] transition-all bg-gradient-to-b text-sm font-semibold leading-tight rounded-full border py-1 px-3 flex items-center gap-2">
                                <StarsSolidIcon className="shrink-0 text-[#965084] w-4 h-4" />{' '}
                                Nilai Tertinggi
                            </Tabs.Trigger>

                            <Tabs.Trigger
                                value="custom"
                                type="button"
                                className="data-[state=active]:from-[#FFFFFFB2] data-[state=active]:to-[#F2F2F2E5] data-[state=active]:text-black data-[state=active]:border-[#FFFFFF2B] data-[state=inactive]:from-black/10 data-[state=inactive]:to-[#F2F2F21A] data-[state=inactive]:text-white data-[state=inactive]:border-[#FFFFFF2B] transition-all bg-gradient-to-b text-sm font-semibold leading-tight rounded-full border py-1 px-3">
                                Custom
                            </Tabs.Trigger>
                        </Tabs.List>

                        {/* highest score */}
                        <Tabs.Content
                            value="nilai_tertinggi"
                            className="space-y-3">
                            {data?.highest_tryout?.problemsets.map((v) => (
                                <SubtestInput
                                    key={v.course_cover}
                                    course_name={v.course_name}
                                    course_cover={v.course_cover}
                                    score_num={v.score}
                                />
                            ))}
                        </Tabs.Content>

                        {/* custom */}
                        <Tabs.Content value="custom">
                            {problemsetsMap ? (
                                Object.entries(problemsetsMap).map(([k, v]) => (
                                    <SubtestInput
                                        key={k}
                                        course_name={k}
                                        course_cover={v.course_cover}
                                        disabled={false}
                                        score_str={v.score}
                                        handleInputChange={handleInputChange}
                                    />
                                ))
                            ) : (
                                <></>
                            )}
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            </div>
        </div>
    );
}

export { AturStrategi };
