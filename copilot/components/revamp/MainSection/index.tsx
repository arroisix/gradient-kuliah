import { PencilLineIcon, XIcon } from 'lucide-react';
import { useGetStudentTryoutLatestResultQuery } from 'exercises/redux/api/exercisesApi';
import ExamplePrompts from './ExamplePrompts';
import { cn, formatDate } from 'commons/utils';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from 'authentication/contexts/AuthProvider';

type ContentType =
    | 'course_video'
    | 'textbook_problem'
    | 'bank_soal_problem'
    | 'astronotes_content'
    | null;

interface MainSectionProps {
    contentType?: ContentType;
    onSendMessage: (prompt: string, imageUrl?: string) => void;
}

const MainSection = ({
    contentType,
    onSendMessage
}: MainSectionProps): JSX.Element => {
    const [isShowBanner, setIsShowBanner] = useState(false);
    const { data, isLoading } = useGetStudentTryoutLatestResultQuery();
    const { profile } = useAuth();

    const handleClick = () => {
        const prompt = data?.is_has_latest_result
            ? 'Lihat Analisa Try Out Terakhir'
            : 'Minta Panduan Belajar UTBK';
        onSendMessage(prompt);
    };

    useEffect(() => {
        if (!isLoading) {
            setIsShowBanner(true);
        }
    }, [data, isLoading]);

    return (
        <div>
            <h2
                className={cn(
                    'text-white font-bold text-center leading-[140%] mb-4',
                    'md:font-semibold md:text-xl md:mb-3'
                )}>
                Lagi butuh bantuan apa?
            </h2>

            {isLoading ? (
                <div className="animate-pulse bg-[#333333] w-full max-w-[600px] h-20 mx-auto rounded-lg mb-4"></div>
            ) : isShowBanner ? (
                <div
                    className={cn(
                        'bg-gradient-to-br from-[#2C2C2C] to-[#f2c04c]/20 relative space-y-3 p-3 rounded-lg w-full max-w-[343px] mx-auto mb-4',
                        'md:max-w-[600px] md:p-4 md:space-y-0 md:flex md:justify-between md:items-center md:gap-3 md:bg-gradient-to-r md:mb-6'
                    )}>
                    <button
                        type="button"
                        onClick={() => setIsShowBanner(false)}
                        className="absolute top-[-12px] right-[-12px] w-6 h-6 rounded-full grid place-items-center bg-gradient-to-bl from-black/10 to-[#F2F2F2]/10 hover:from-black/30 hover:to-[#F2F2F2]/30 transition-colors">
                        <XIcon className="text-[#B6A6F3] w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3">
                        <PencilLineIcon className="text-[#F2C04C] w-6 h-6" />

                        <div className="space-y-1">
                            <h3 className="text-white font-semibold text-sm">
                                {data?.is_has_latest_result
                                    ? `TO Terakhir: ${formatDate(
                                          data.latest_result_date ??
                                              new Date().toISOString()
                                      )} - Skor: ${
                                          data.latest_result_score ?? 0
                                      }`
                                    : data?.is_has_ongoing_tryout
                                    ? `TO Berlangsung: ${data.latest_result_tryout_title}`
                                    : 'Hai! Kamu belum pernah ikut Try Out ya'}
                            </h3>

                            <p className="text-white text-xs">
                                {data?.is_has_latest_result
                                    ? 'Coba Try Out dulu untuk lihat kelebihan dan kekuranganmu.'
                                    : data?.is_has_ongoing_tryout
                                    ? 'Yuk, lihat kelebihan dan kekuranganmu dengan menyelesaikan Try Out.'
                                    : 'Yuk coba Try out biar Copilot bisa kasih rekomendasi yang lebih pas.'}
                            </p>
                        </div>
                    </div>

                    {data?.is_has_ongoing_tryout ? (
                        <Link
                            href={
                                profile?.current_role === 'COLLEGE_STUDENT'
                                    ? '/latihan'
                                    : '/utbk/try-out'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 w-fit ml-auto text-sm font-semibold leading-tight h-[34px] px-3 grid place-items-center rounded-full border border-[#999999] hover:border-white transition-colors">
                            Lihat Try Out
                        </Link>
                    ) : (
                        <button
                            onClick={handleClick}
                            className="shrink-0 w-fit ml-auto text-sm font-semibold leading-tight h-[34px] px-3 grid place-items-center rounded-full border border-[#999999] hover:border-white transition-colors">
                            {data?.is_has_latest_result
                                ? 'Lihat Analisa'
                                : 'Coba Try Out'}
                        </button>
                    )}
                </div>
            ) : (
                <></>
            )}

            <ExamplePrompts
                onPromptClick={onSendMessage}
                contentType={contentType}
            />
        </div>
    );
};

export default MainSection;
