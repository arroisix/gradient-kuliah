// import { PencilLineIcon, XIcon } from 'lucide-react';
import ExamplePrompts from './ExamplePrompts';
// import Link from 'next/link';
// import { useState } from 'react';
import { cn } from 'commons/utils';

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
    // const [isShowBanner, setIsShowBanner] = useState(true);

    return (
        <div>
            <h2
                className={cn(
                    'text-white font-bold text-center leading-[140%] mb-4',
                    'md:font-semibold md:text-xl md:mb-3'
                )}>
                Lagi butuh bantuan apa?
            </h2>

            {/* {isShowBanner ? (
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

                    <PencilLineIcon className="text-[#F2C04C] w-6 h-6" />

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
                        className="w-fit ml-auto text-sm font-semibold leading-tight h-[34px] px-3 grid place-items-center rounded-full border border-[#999999] hover:border-white transition-colors">
                        Coba Try Out
                    </Link>
                </div>
            ) : (
                <></>
            )} */}

            <ExamplePrompts
                onPromptClick={onSendMessage}
                contentType={contentType}
            />
        </div>
    );
};

export default MainSection;
