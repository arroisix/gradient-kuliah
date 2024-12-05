import Link from 'next/link';
import CopilotIconFill from '../assets/CopilotIconFill';
import RobotEntrypoint from '../assets/RobotEntrypoint';

interface CopilotEntrypointProps {
    text?: string;
    subtext?: string;
}

export default function CopilotEntrypoint({
    text = 'Kamu ada pertanyaan terkait materi ini?',
    subtext
}: CopilotEntrypointProps) {
    return (
        <div className="order-last bg-gradient-to-t from-black to-transparent rounded-lg shadow-lg py-4">
            <div className="absolute top-8 right-4 z-20 lg:hidden">
                <RobotEntrypoint />
            </div>
            <div className="flex flex-col items-start gap-4 bg-[#222222] rounded-lg p-4 pt-6 relative z-10">
                <div className="w-[60%] flex flex-col gap-1">
                    <span className="text-start text-white font-medium">
                        {text}
                    </span>
                    {subtext && (
                        <span className="text-sm text-neutral-400">
                            {subtext}
                        </span>
                    )}
                </div>
                <Link
                    href="/copilot"
                    className="w-full bg-[#5F2BCE] hover:bg-[#4F24A8] text-white font-medium p-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <CopilotIconFill />
                    <span>Tanya Copilot AI</span>
                </Link>
            </div>
        </div>
    );
}
