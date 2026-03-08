import { StarsSolidIcon } from 'commons/components/elements/Icons/StarsSolidIcon';
import { useGetAdmissionChanceQuery } from 'dashboard/redux/api/dashboardApi';
import { ChevronLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs } from 'radix-ui';
import { useEffect, useState } from 'react';
import { PeluangCard } from './PeluangCard';

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
        <div className="min-h-screen bg-black">
            {/* top bar */}
            <div className="flex justify-between items-center p-4 mb-4">
                <Link
                    href="/utbk/dashboard"
                    className="bg-[#333333] rounded-full w-8 h-8 grid place-items-center">
                    <ChevronLeftIcon className="shrink-0 w-4 h-4 text-white" />
                </Link>

                <h1 className="text-white font-semibold leading-[140%]">
                    Atur Strategi
                </h1>

                <div></div>
            </div>

            {/* peluang masuk card */}
            {isLoading ? (
                <div className="animate-pulse bg-[#333333] rounded-xl w-full max-w-[416px] h-[270px] mx-auto mb-6"></div>
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
            <div className="bg-[#101010] px-4 py-6 rounded-t-2xl">
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
                    <Tabs.Content value="nilai_tertinggi" className="space-y-3">
                        {data?.highest_tryout?.problemsets.map((v) => (
                            <div
                                key={v.course_name}
                                className="bg-[#00000066] border border-[#27272A] rounded-2xl p-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#333333] w-10 h-10 grid place-items-center rounded-full">
                                        <Image
                                            src={v.course_cover}
                                            alt={v.course_name}
                                            width={24}
                                            height={24}
                                            className="object-cover object-center"
                                        />
                                    </div>

                                    <div className="text-[#DEDEDE] text-sm leading-[160%]">
                                        {v.course_name}
                                    </div>
                                </div>

                                <div className="hidden-input-number-icon">
                                    <input
                                        disabled
                                        type="number"
                                        placeholder="Nilai"
                                        name={v.course_name}
                                        value={v.score}
                                        max={1000}
                                        className="focus:border-[#999999] placeholder:text-[#999999] focus:outline-none focus:ring-0 focus:appearance-none w-full bg-[#222222] text-white border border-[#333333] rounded-lg py-2 px-4"
                                    />
                                </div>
                            </div>
                        ))}
                    </Tabs.Content>

                    {/* custom */}
                    <Tabs.Content value="custom">
                        {problemsetsMap ? (
                            Object.entries(problemsetsMap).map(([k, v]) => (
                                <div
                                    key={k}
                                    className="bg-[#00000066] border border-[#27272A] rounded-2xl p-4 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#333333] w-10 h-10 grid place-items-center rounded-full">
                                            <Image
                                                src={v.course_cover}
                                                alt={k}
                                                width={24}
                                                height={24}
                                                className="object-cover object-center"
                                            />
                                        </div>

                                        <div className="text-[#DEDEDE] text-sm leading-[160%]">
                                            {k}
                                        </div>
                                    </div>

                                    <div className="hidden-input-number-icon">
                                        <input
                                            type="number"
                                            placeholder="Nilai"
                                            name={k}
                                            value={v.score}
                                            onChange={(event) =>
                                                handleInputChange(
                                                    k,
                                                    event.currentTarget.value
                                                )
                                            }
                                            max={1000}
                                            className="focus:border-[#999999] placeholder:text-[#999999] focus:outline-none focus:ring-0 focus:appearance-none w-full bg-[#222222] text-white border border-[#333333] rounded-lg py-2 px-4"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <></>
                        )}
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    );
}

export { AturStrategi };
