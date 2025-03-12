import React from 'react';

interface ScoreCardProps {
    score: number;
    correctAnswers: number;
    incorrectAnswers: number;
    improvement: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
    score,
    correctAnswers,
    incorrectAnswers,
    improvement
}) => {
    return (
        <div className="bg-[#1B2129] w-full p-6 rounded-lg mb-6">
            <h2 className="text-sm text-[#999999] mb-1 text-center">
                Nilai Akhir Kamu (Max. 100)
            </h2>
            <p className="text-4xl font-bold mb-2 text-center text-white">
                {score}
            </p>
            <p className="mb-4 text-center text-sm text-white">
                {improvement
                    ? 'Yay, nilai kamu lebih baik dari percobaan sebelumnya! 🤗🎉'
                    : 'Terus semangat belajar!'}
            </p>
            <div className="w-full bg-[#EA5C49] h-2 rounded-full mb-2">
                <div
                    className="bg-[#2AC079] h-2 rounded-full"
                    style={{
                        width: `${
                            (correctAnswers /
                                (correctAnswers + incorrectAnswers)) *
                            100
                        }%`
                    }}></div>
            </div>
            <div className="flex justify-between text-sm">
                <div className="flex flex-row items-center justify-center gap-1">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#2AC27A] text-white text-xs">
                        ✓
                    </div>
                    <div className="text-white">{correctAnswers} Soal</div>
                </div>
                <div className="flex flex-row items-center justify-center gap-1">
                    <div className="text-white">{incorrectAnswers} Soal</div>
                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#EC5D49] text-white text-xs">
                        ✗
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreCard;
