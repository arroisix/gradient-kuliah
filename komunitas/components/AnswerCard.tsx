import { useGetProfileQuery } from 'authentication/redux/api/authApi';
import useWindowBreakpoints from 'commons/hooks/useWindowBreakpoints';
import Image from 'next/image';
import { useState } from 'react';
import Avatar from 'react-avatar';
import { BsHexagonFill, BsCheck } from 'react-icons/bs';
import { FaCircle, FaRegComment } from 'react-icons/fa';
import ReplyComment from './ReplyComment';

const DUMMY_COMMENT = [
    {
        photo_profile: '',
        full_name: 'Irfan Kamil',
        text: 'Kayaknya ga gitu deh'
    },
    {
        photo_profile: '',
        full_name: 'Kamil IRfan',
        text: 'Makasih banyak kakk'
    }
];

const AnswerCard = ({
    isVerified = false
}: {
    isVerified?: boolean;
}): JSX.Element => {
    const [comment, setComment] = useState('');
    const [showComment, setShowComment] = useState(false);

    const { data } = useGetProfileQuery({}); // ! ambil data user yg jawab
    const { checkCustomBreakpoints } = useWindowBreakpoints();

    function handleChangeComment(e: React.ChangeEvent<HTMLInputElement>): void {
        setComment(e.target.value);
    }

    return (
        <div
            className={`flex flex-col gap-3 w-full border-[1px] rounded-xl p-[18px] md:p-5 ${
                isVerified
                    ? 'border-[#00880080] bg-[#0088001A]'
                    : 'border-neutral-800'
            }`}>
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-[24px] h-[24px]">
                        {data?.photo_profile ? (
                            <Image
                                src={data?.photo_profile}
                                alt={data?.full_name}
                                layout="fill"
                                className="rounded-full object-contain"
                            />
                        ) : (
                            <Avatar name={data?.full_name} size="24" round />
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
                {isVerified && (
                    <div className="flex items-center gap-[6px] px-[10px] py-[3.5px] rounded-[70px] bg-[#008800]">
                        <div className="relative w-[14px] h-[14px]">
                            <BsHexagonFill className="text-white" size={14} />
                            <BsCheck
                                className="absolute top-0 left-0 text-[#008800]"
                                size={14}
                            />
                        </div>
                        <span className="font-bold text-[10px] text-center">
                            {!checkCustomBreakpoints(375) && 'Jawaban'}{' '}
                            Terverifikasi
                        </span>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-[18px]">
                <article>
                    <p className="text-xs font-body">Jawabn</p>
                </article>
                <div
                    className="flex items-center gap-2 w-fit cursor-pointer"
                    onClick={() => setShowComment((prev) => !prev)}
                    aria-hidden>
                    <FaRegComment className="scale-x-[-1]" size={18} />
                    <span className="font-body text-xs">2</span>
                </div>
            </div>
            <div className="flex flex-col gap-6 border-t-[1px] border-[#272727] pt-[18px]">
                <div className="flex gap-3 items-center">
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
                    <input
                        type="text"
                        name="comment"
                        value={comment}
                        onChange={handleChangeComment}
                        placeholder="Tambahkan komentar"
                        className="w-full text-xs bg-[#1D1D1D] rounded-[70px] border-none placeholder:text-neutral-600 focus:outline-none focus:ring-0 focus:appearance-none"
                    />
                </div>
                {showComment && (
                    <div className="flex flex-col gap-[18px]">
                        {DUMMY_COMMENT.map((val) => (
                            <ReplyComment key={val.full_name} data={val} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnswerCard;
