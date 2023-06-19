import Image from 'next/image';
import Avatar from 'react-avatar';

type DUMMY = {
    photo_profile: string;
    full_name: string;
    text: string;
};

const ReplyComment = ({ data }: { data: DUMMY }): JSX.Element => {
    return (
        <div className="flex gap-3 items-center">
            <div className="relative w-[20px] h-[20px]">
                {data?.photo_profile ? (
                    <Image
                        src={data?.photo_profile}
                        alt={data?.full_name}
                        layout="fill"
                        className="rounded-full object-contain"
                    />
                ) : (
                    <Avatar
                        name={data?.full_name}
                        size="20"
                        round
                        className="!block"
                    />
                )}
            </div>
            <article className="w-full">
                <p className="text-xs font-body">{data.text}</p>
            </article>
        </div>
    );
};

export default ReplyComment;
