import Image from 'next/image';
import Avatar from 'react-avatar';

type User = {
    id: string;
    photo_url: string;
    username: string;
    is_expert: boolean;
};

const ReplyComment = ({
    content,
    user
}: {
    content: string;
    user: User;
}): JSX.Element => {
    return (
        <div className="flex gap-3 items-center">
            <div className="relative w-[20px] h-[20px]">
                {user?.photo_url ? (
                    <Image
                        src={user?.photo_url}
                        alt={user?.username}
                        layout="fill"
                        className="rounded-full object-contain"
                    />
                ) : (
                    <Avatar
                        name={user?.username}
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
