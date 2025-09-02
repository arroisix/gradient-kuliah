import CopilotIconFill from '../assets/CopilotIconFill';
import RobotEntrypoint from '../assets/RobotEntrypoint';
import { useTracker } from 'tracker/tracker';

interface CopilotEntrypointProps {
    text?: string;
    subtext?: string;
    onClick?: () => void;
}

export default function CopilotEntrypoint({
    text = 'Kamu ada pertanyaan terkait materi ini?',
    subtext,
    onClick
}: CopilotEntrypointProps) {
    const tracker = useTracker();

    const handleClick = () => {
        tracker?.genericTrack('User click Check on Copilot');

        if (onClick) {
            onClick();
        }
    };

    return (
        <div className="order-last bg-gradient-to-t from-black to-transparent rounded-lg shadow-lg py-4">
            <div className="bg-[#222222] rounded-lg p-4 pt-6 relative">
                <div className="absolute top-0 right-4">
                    <RobotEntrypoint />
                </div>
                <div className="flex flex-col gap-4">
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
                    <button
                        onClick={handleClick}
                        disabled={!onClick}
                        className={`w-full font-medium p-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                            onClick
                                ? 'bg-[#5F2BCE] hover:bg-[#4F24A8] text-white'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}>
                        <CopilotIconFill />
                        <span>Tanya Copilot AI</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
