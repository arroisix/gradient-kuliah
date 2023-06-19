import { useGetProfileQuery } from 'authentication/redux/api/authApi';
import Image from 'next/image';
import Avatar from 'react-avatar';
import { AiOutlineEye } from 'react-icons/ai';
import { FaCircle, FaRegComment } from 'react-icons/fa';

const QuestionCard = (): JSX.Element => {
    const { data } = useGetProfileQuery({});

    return (
        <div className="w-full border-[1px] border-neutral-800 rounded-xl p-[18px] md:p-5">
            <div className="relative flex items-center gap-3">
                <div className="relative w-[24px] h-[24px]">
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
                            size="24"
                            round
                            className="!block"
                        />
                    )}
                </div>
                <div className="flex flex-col md:flex-row md:gap-[6px] md:items-center">
                    <span className="inline-block font-extrabold text-xs">
                        {data?.full_name}
                    </span>
                    <FaCircle
                        className="hidden md:block text-neutral-600"
                        size={4}
                    />
                    <span className="inline-block font-body text-xs text-neutral-600">
                        2h
                    </span>
                </div>
            </div>
            <article className="pt-[12px] pb-[18px] lg:pl-[56px]">
                <p className="text-xs font-body">pertanayan</p>
            </article>
            <div className="flex justify-between">
                <div className="flex gap-6 items-center">
                    <div className="flex items-center gap-2">
                        <AiOutlineEye size={18} />
                        <span className="font-body text-xs">2</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaRegComment className="scale-x-[-1]" size={18} />
                        <span className="font-body text-xs">2</span>
                    </div>
                </div>
                <button className="bg-neutral-800 px-[27px] py-[7.5px] rounded-[70px] font-extrabold text-xs">
                    Jawab
                </button>
            </div>
        </div>
    );
};

export default QuestionCard;
