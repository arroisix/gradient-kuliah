import { BiBot } from 'react-icons/bi';
import Link from 'next/link';

export default function CopilotEntrypoint() {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <div className="mb-4">
                <div className="flex items-center gap-3 bg-[#222222] rounded-lg p-4">
                    <div className="bg-black/30 rounded-lg p-2">
                        <BiBot size={24} className="text-neutral-400" />
                    </div>
                    <span className="text-white font-medium">
                        Kamu ada pertanyaan terkait materi ini?
                    </span>
                </div>
            </div>

            <Link
                href="/copilot"
                className="w-full bg-[#5F2BCE] hover:bg-[#4F24A8] text-white font-medium p-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <BiBot size={20} />
                <span>Tanya Copilot AI</span>
            </Link>
        </div>
    );
}
