import { isNotNullAndUndefined } from 'commons/utils';
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
        <div className="flex gap-3 items-center">
            <div className="relative w-[20px] h-[20px]">
                {isNotNullAndUndefined(student?.photo_url) && !imageError ? (
                    <Image
                        src={student?.photo_url ?? ''}
                        alt={student?.username}
                        layout="fill"
                        className="rounded-full object-contain"
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
            <article className="w-full">
                <p className="text-xs font-body">{content}</p>
            </article>
        </div>
    );
};

export default ReplyComment;
