import { cn } from 'commons/utils';
import { Check, X } from 'lucide-react';
import { FaExclamation } from 'react-icons/fa6';

interface AnswerLegendProps {
    className?: string;
    removeYellowLegend?: boolean;
}

const AnswerLegend: React.FC<AnswerLegendProps> = ({
    className,
    removeYellowLegend
}) => {
    return (
        <div className={cn('flex flex-col gap-2 text-sm', className)}>
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-state-success flex items-center justify-center">
                    <Check
                        size={12}
                        strokeWidth={3}
                        className="text-violet-1"
                    />
                </div>
                <span className="text-white">Jawaban Benar</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-state-error flex items-center justify-center">
                    <X size={12} strokeWidth={3} className="text-violet-1" />
                </div>
                <span className="text-white">Jawaban Salah</span>
            </div>
            {!removeYellowLegend && (
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                        <FaExclamation size={12} className="text-violet-1" />
                    </div>
                    <span className="text-white">
                        Jawaban Benar yang tidak dipilih
                    </span>
                </div>
            )}
        </div>
    );
};

export default AnswerLegend;
