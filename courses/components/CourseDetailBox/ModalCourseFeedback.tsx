import Button from 'commons/components/elements/Button';
import TextareaAutosize from 'react-textarea-autosize';
import { useEffect, useState } from 'react';
import { MdStarPurple500 } from 'react-icons/md';
import { usePostCourseFeedbackMutation } from 'courses/redux/api/courseApi';
import { useRouter } from 'next/router';
import Spinner from 'commons/components/elements/Spinner';

const ModalCourseFeedback = ({
    setOpen
}: {
    setOpen: (status: 1 | 0) => void;
}): JSX.Element => {
    const [starClicked, setStarClicked] = useState(0);
    const [content, setContent] = useState('');
    const stars = [1, 2, 3, 4, 5];

    const { id } = useRouter().query;
    const [postFeedback, { isLoading, isSuccess }] =
        usePostCourseFeedbackMutation();

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        setContent(event.target.value);
    }

    function handleSubmit(): void {
        postFeedback({ slug: id as string, content, rating: starClicked });
    }

    useEffect(() => {
        if (isSuccess) {
            setOpen(0);
        }
    }, [isSuccess, setOpen]);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
                <span className="inline-block pr-[20px] font-body text-sm">
                    Seberapa mungkin kamu akan merekomendasikan kelas ini ke
                    teman atau kenalanmu?
                </span>
                <div className="flex justify-center gap-[10px]">
                    {stars.map((value) => (
                        <MdStarPurple500
                            key={value}
                            size={24}
                            className={`hover:text-white cursor-pointer ${
                                starClicked >= value
                                    ? 'text-white'
                                    : 'text-neutral-700'
                            }`}
                            onClick={() => setStarClicked(value)}
                        />
                    ))}
                </div>
                <div>
                    <TextareaAutosize
                        value={content}
                        name="feedback"
                        onChange={handleChange}
                        placeholder="Tulis feedback...."
                        className="w-full h-full min-h-[124px] p-[10px] font-body text-xs bg-[#242424] border-none rounded-[10px] focus:outline-none focus:ring-0 focus:appearance-none placeholder:text-neutral-400"
                    />
                </div>
            </div>
            <Button
                variant="primary"
                className="w-full"
                onClick={handleSubmit}
                disabled={!content || starClicked === 0}>
                {isLoading ? <Spinner size="small" /> : 'Kirim'}
            </Button>
        </div>
    );
};

export default ModalCourseFeedback;
