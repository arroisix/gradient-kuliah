import Image from 'next/image';
import { useState } from 'react';
import Avatar from 'react-avatar';

type Student = {
    id: string;
    photo_url: string;
    username: string;
    is_expert: boolean;
};

const ReplyComment = ({
    content,
    student
}: {
    content: string;
    student: Student;
}): JSX.Element => {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="flex items-start gap-3">
            <div className="relative w-[20px] h-[20px]">
                {student?.photo_url &&
                student.photo_url.length > 0 &&
                !imageError ? (
                    <Image
                        src={student?.photo_url}
                        alt={student?.username}
                        layout="fill"
                        className="object-contain rounded-full"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <Avatar
                        name={student?.username}
                        size="20"
                        round
                        className="!block"
                    />
                )}
            </div>
            <article className="self-center w-full">
                <p className="text-xs whitespace-pre-line font-body">
                    {content}
                </p>
            </article>
        </div>
    );
};

export default ReplyComment;
