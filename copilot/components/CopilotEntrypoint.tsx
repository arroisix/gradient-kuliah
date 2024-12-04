import Link from 'next/link';
import CopilotIconFill from '../assets/CopilotIconFill';
import RobotEntrypoint from '../assets/RobotEntrypoint';

export default function CopilotEntrypoint() {
    return (
        <div className="order-last bg-gradient-to-t from-black to-transparent rounded-lg shadow-lg py-4">
            <div className="absolute top-8 right-4 z-20 lg:hidden">
                <RobotEntrypoint />
            </div>
            <div className="flex flex-col items-start gap-4 bg-[#222222] rounded-lg p-4 pt-6 relative z-10">
                <span className="w-[60%] text-start text-white font-medium">
                    Kamu ada pertanyaan terkait materi ini?
                </span>
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
