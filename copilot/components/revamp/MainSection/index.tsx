import { PencilLineIcon, XIcon } from 'lucide-react';
import ExamplePrompts from './ExamplePrompts';
import Link from 'next/link';
import { useState } from 'react';

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
    const [isShowBanner, setIsShowBanner] = useState(true);

    return (
        <div className="space-y-4">
            <h2 className="text-white font-bold text-center">
                Lagi butuh bantuan apa?
            </h2>

            {isShowBanner ? (
                <div className="relative bg-[#2C2C2C] space-y-3 p-3 rounded-lg w-full max-w-[343px] mx-auto">
                    <button
                        type="button"
                        onClick={() => setIsShowBanner(false)}
                        className="absolute top-[-12px] right-[-12px] w-6 h-6 rounded-full grid place-items-center bg-gradient-to-bl from-black/10 to-[#F2F2F2]/10">
                        <XIcon className="text-[#B6A6F3] w-4 h-4" />
                    </button>

                    <PencilLineIcon className="text-[#F2C04C] w-6 h-6 place-self-start" />

                    <div className="space-y-1">
                        <h3 className="text-white font-semibold text-sm">
                            Hai! Kamu belum pernah ikut Try Out ya
                        </h3>

                        <p className="text-white text-xs">
                            Yuk coba Try out biar Copilot bisa kasih rekomendasi
                            yang lebih pas
                        </p>
                    </div>

                    <Link
                        href="/utbk/try-out"
                        className="w-fit ml-auto text-sm font-semibold leading-tight h-[34px] px-3 grid place-items-center rounded-full border border-[#999999]">
                        Coba Try Out
                    </Link>
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
