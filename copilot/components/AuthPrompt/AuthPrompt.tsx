import { RiCameraFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import { cn } from 'commons/utils';
import { BsQuestionCircleFill } from 'react-icons/bs';

interface CopilotAuthPromptProps {
    className?: string;
}

const CopilotAuthPrompt = ({ className }: CopilotAuthPromptProps) => {
    const { isMobileBreakpoints } = useWindowBreakpoints();

    return (
        <div
            className={cn(
                'fixed inset-x-0 bottom-0 z-50',
                isMobileBreakpoints ? 'top-0' : 'top-0',
                className
            )}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div className="relative h-full flex items-center justify-center md:px-12 md:pt-4">
                <div className="w-full px-4 md:px-12 lg:px-24 md:pt-8">
                    <div className="max-w-md mx-auto w-full bg-[#1D1D1D] rounded-2xl p-6 md:p-8 shadow-2xl">
                        <h1 className="text-xl md:text-2xl font-bold text-center mb-2">
                            Masuk untuk bertanya Gratis ke Copilot AI (Beta)
                        </h1>
                        <p className="text-neutral-400 text-center text-sm md:text-base mb-8">
                            Chatbot untuk segala kebutuhan belajar
                        </p>

                        <div
                            className={cn(
                                isMobileBreakpoints
                                    ? 'overflow-x-auto scrollbar-none pb-4'
                                    : 'mb-8'
                            )}>
                            <div
                                className={cn(
                                    'flex flex-row items-center gap-2',
                                    isMobileBreakpoints
                                        ? 'w-max'
                                        : 'justify-center'
                                )}>
                                <button className="flex shrink-0 items-center justify-center gap-2 bg-[#222222] hover:bg-neutral-800 px-4 py-3 rounded-lg transition-colors">
                                    <BsQuestionCircleFill color="#5F2BCE" />
                                    <span>Tanya Soal</span>
                                </button>
                                <button className="flex shrink-0 items-center justify-center gap-2 bg-[#222222] hover:bg-neutral-800 px-4 py-3 rounded-lg transition-colors">
                                    <RiCameraFill color="#5D75FF" />
                                    <span>Scan Foto Soal</span>
                                </button>
                                <button className="flex shrink-0 items-center justify-center gap-2 bg-[#222222] hover:bg-neutral-800 px-4 py-3 rounded-lg transition-colors">
                                    <span>+ Lainnya</span>
                                </button>
                            </div>
                        </div>

                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-neutral-800"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-[#1D1D1D] px-4 text-sm text-neutral-400">
                                    MASUK DENGAN
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Link href="/masuk" className="block w-full">
                                <button className="w-full flex items-center justify-center gap-2 bg-[#222222] hover:bg-neutral-800 py-3 px-4 rounded-lg transition-colors">
                                    <FcGoogle size={20} />
                                    <span>Google</span>
                                </button>
                            </Link>

                            <Link href="/daftar" className="block w-full">
                                <button className="w-full bg-[#222222] hover:bg-neutral-800 py-3 px-4 rounded-lg transition-colors">
                                    Buat Akun
                                </button>
                            </Link>

                            <div className="text-center text-sm">
                                <span className="text-neutral-400">
                                    Sudah punya akun?{' '}
                                </span>
                                <Link
                                    href="/masuk"
                                    className="text-[#B6A6F3] hover:underline">
                                    Log In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CopilotAuthPrompt;
