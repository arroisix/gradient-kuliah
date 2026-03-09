import Image from 'next/image';

interface BaseProps {
    course_name: string;
    course_cover: string;
    disabled?: boolean;
    handleInputChange?: (course_name: string, value: string) => void;
}

interface ScoreString {
    score_str: string;
    score_num?: number;
}

interface ScoreNumber {
    score_str?: string;
    score_num: number;
}

type SubtestInputProps = BaseProps & (ScoreString | ScoreNumber);

function SubtestInput({
    course_name,
    course_cover,
    disabled = true,
    score_str,
    score_num,
    handleInputChange
}: SubtestInputProps): JSX.Element {
    return (
        <div
            key={course_name}
            className="bg-[#00000066] border border-[#27272A] rounded-2xl p-4 space-y-4">
            <div className="flex items-center gap-3">
                <div className="bg-[#333333] w-10 h-10 grid place-items-center rounded-full">
                    <Image
                        src={course_cover}
                        alt={course_name}
                        width={24}
                        height={24}
                        className="object-cover object-center"
                    />
                </div>

                <div className="text-[#DEDEDE] text-sm leading-[160%]">
                    {course_name}
                </div>
            </div>

            <div className="hidden-input-number-icon">
                <input
                    disabled={disabled}
                    type="number"
                    placeholder="Nilai"
                    name={course_name}
                    value={score_str ?? score_num}
                    onChange={(event) =>
                        handleInputChange &&
                        handleInputChange(
                            course_name,
                            event.currentTarget.value
                        )
                    }
                    max={1000}
                    className="focus:border-[#999999] placeholder:text-[#999999] focus:outline-none focus:ring-0 focus:appearance-none w-full bg-[#222222] text-white border border-[#333333] rounded-lg py-2 px-4"
                />
            </div>
        </div>
    );
}

export { SubtestInput };
