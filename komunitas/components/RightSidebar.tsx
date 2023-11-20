import AuthContext from 'authentication/contexts/AuthProvider';
import Skeleton from 'commons/components/elements/Skeleton';
import {
    useGetExploreQuestionQuery,
    useGetMyQuestionListQuery,
    useGetPublicExploreQuestionQuery
} from 'komunitas/redux/api/komunitasApi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { MdChevronRight } from 'react-icons/md';
import MyQuestions from './MyQuestions';
import { useSelector } from 'react-redux';
import { getIsAuthenticated } from 'authentication/redux/selectors/userSelector';
import { skipToken } from '@reduxjs/toolkit/dist/query';

const RightSidebar = ({ askNow }: { askNow?: () => void }): JSX.Element => {
    const router = useRouter();
    const { pathname } = router;
    const { profile } = useContext(AuthContext);

    const isAuthenticated = useSelector(getIsAuthenticated);
    const { data: myQuestion, isLoading: isLoadingMyQuestion } =
        useGetMyQuestionListQuery(
            { user_id: profile?.user_id as string },
            {
                skip: !isAuthenticated || !profile?.user_id,
                refetchOnMountOrArgChange: true
            }
        );

    const privateExploreQuestionResult = useGetExploreQuestionQuery(
        !pathname.includes('pertanyaan-ku') || !isAuthenticated ? skipToken : {}
    );
    const publicExploreQuestionResult = useGetPublicExploreQuestionQuery(
        !pathname.includes('pertanyaan-ku') || isAuthenticated ? skipToken : {}
    );
    const { data: sideExploreData, isLoading: isLoadingSideExplore } =
        isAuthenticated
            ? privateExploreQuestionResult
            : publicExploreQuestionResult;

    return (
        <div className="hidden md:block lg:sticky lg:top-20 w-full h-[85vh] bg-[#121212] ml-[-16px] mb-[-40px] md:m-0 px-[18px] py-5 md:rounded-lg overflow-hidden">
            <h4 className="font-extrabold pb-[20px]">
                {pathname.includes('pertanyaan-ku')
                    ? 'Eksplor'
                    : 'Pertanyaanku'}
            </h4>
            <div className="flex-1 flex flex-col gap-[18px]">
                {pathname.includes('pertanyaan-ku') ? (
                    isLoadingSideExplore ? (
                        <Skeleton repeat={3} className="h-3 !mb-0" />
                    ) : (
                        <div className="flex flex-col gap-2 bg-[#1D1D1D] rounded">
                            {sideExploreData?.questions?.map(
                                ({ slug, content }) => (
                                    <Link
                                        key={slug}
                                        href={`/komunitas/${slug}`}>
                                        <div className="flex justify-between items-center gap-2 cursor-pointer z-[1] px-[10px] py-[10px] first:border-none border-t-[1px] border-t-[#2C2C2C]">
                                            <span className="overflow-hidden text-xs whitespace-nowrap text-ellipsis">
                                                {content}
                                            </span>
                                            <div>
                                                <MdChevronRight
                                                    className="text-neutral-600"
                                                    size={18}
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                )
                            )}
                        </div>
                    )
                ) : isLoadingMyQuestion ? (
                    <Skeleton repeat={3} className="h-3 !mb-0" />
                ) : (
                    <MyQuestions
                        questions={profile ? myQuestion?.questions : []}
                        askNow={askNow}
                    />
                )}
            </div>
            {profile && myQuestion?.questions.length != 0 && (
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-[#121212] to-[#121212] z-[1]"></div>
                    <div className="absolute bottom-0 left-0 w-full px-[18px] z-[1]">
                        <button
                            className="bg-neutral-800 font-extrabold text-xs w-full py-2 rounded-[70px]"
                            onClick={() => {
                                router.push(
                                    pathname.includes('pertanyaan-ku')
                                        ? '/komunitas'
                                        : '/komunitas/pertanyaan-ku'
                                );
                            }}>
                            {pathname.includes('pertanyaan-ku')
                                ? 'Lihat di Komunitas'
                                : 'Lihat Semua'}
                        </button>
                        <div className="w-full h-[48px] md:h-[20px] bg-[#121212]"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RightSidebar;
