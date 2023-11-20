import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { MdChevronRight } from 'react-icons/md';

type MyQuestionsProps = {
    questions?: MyQuestionListResponse['questions'];
};

const MyQuestions = ({ questions }: MyQuestionsProps): JSX.Element => {
    return questions?.length != 0 ? (
        <>
            {questions?.map((value) => (
                <div key={value.date} className="flex flex-col gap-2">
                    <span className="text-xs font-body text-neutral-600">
                        {moment(value.date).utc().format('MMM DD')}
                    </span>
                    <div className="flex flex-col gap-2 bg-[#1D1D1D] rounded">
                        {value.items.map(
                            ({ slug, content, id, unseen_comment_counts }) => (
                                <Link key={id} href={`/komunitas/${slug}`}>
                                    <div
                                        key={id}
                                        className="flex justify-between items-center gap-2 cursor-pointer z-[1] px-[10px] py-[10px] first:border-none border-t-[1px] border-t-[#2C2C2C]">
                                        <span className="overflow-hidden text-xs whitespace-nowrap text-ellipsis">
                                            {content}
                                        </span>
                                        <div className="flex items-center">
                                            {unseen_comment_counts ? (
                                                <span className="inline-block leading-none py-[2px] pl-[3px] pr-[4px] font-body text-center text-[10px] bg-[#B92011] rounded-full">
                                                    {unseen_comment_counts}
                                                </span>
                                            ) : null}
                                            <MdChevronRight
                                                className="text-neutral-600"
                                                size={18}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            )
                        )}
                    </div>
                </div>
            ))}
        </>
    ) : (
        <div className="absolute flex flex-col items-center justify-center w-full px-5 text-center -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <Image
                src={`${CDN_URL}/assets/komunitas-empty-asset.png`}
                width={120}
                height={120}
                alt="Belum ada pertanyaan"
            />
            <p className="mt-5 mb-3 text-sm font-bold">
                Kamu belum pernah menanyakan apapun
            </p>
            <Button
                variant="custom"
                size="small"
                className="text-xs bg-neutral-800 whitespace-nowrap">
                Buat Pertanyaan Gratis
            </Button>
        </div>
    );
};

export default MyQuestions;
