import { FiArrowUpRight } from 'react-icons/fi';

const EXAMPLE_PROMPTS = [
    'Gimana caranya nyari solusi dari persamaan x² + 5x + 6 = 0?',
    'Mengapa percepatan dianggap vektor?',
    'Bikinin rangkuman buku purcell bab turunan!'
];

const ExamplePrompts = (): JSX.Element => {
    return (
        <div className="flex flex-col gap-3">
            {EXAMPLE_PROMPTS.map((prompt, index) => (
                <button
                    key={index}
                    className="flex items-center justify-between border border-neutral-800 hover:bg-neutral-800/50 px-4 py-3 rounded-lg text-left transition-colors"
                >
                    <span>{prompt}</span>
                    <FiArrowUpRight className="text-neutral-400" />
                </button>
            ))}
        </div>
    );
};

export default ExamplePrompts;