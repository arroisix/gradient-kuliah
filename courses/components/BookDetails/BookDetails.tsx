import Skeleton from 'commons/components/elements/Skeleton';
import Image from 'next/image';
import React from 'react';
import { GrStar } from 'react-icons/gr';
import AstronotesKeyword from '../LearningExperience/AstroNotes/Detail/AstronotesKeyword';
import StartReadingButton from './StartReadingButton';

type BookDetailsProps = {
    astronotes: BookDetailInterface;
};

const BookDetails = ({ astronotes }: BookDetailsProps): JSX.Element => {
    return (
        <>
            <div
                id="details"
                className="flex flex-col items-center gap-4 scroll-mt-32 md:items-start md:flex-row md:gap-6 lg:gap-8">
                <div className="aspect-[256/364] relative min-w-[100px] md:min-w-[150px] max-w-[132px] md:max-w-[164px] h-auto w-[50%] border rounded border-neutral-700">
                    <Image
                        src={
                            astronotes?.cover_url ||
                            'https://assets.gradient.academy/assets/astronotes-kalkulus2-placeholder.jpg'
                        }
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                    />
                </div>
                <div className="flex flex-col items-center gap-4 md:items-start">
                    <h1 className="text-base font-extrabold text-white md:text-lg lg:text-xl">
                        {astronotes?.title ? (
                            astronotes.title
                        ) : (
                            <Skeleton
                                isCustomSize
                                className="w-32 h-4 md:h-5"
                            />
                        )}
                    </h1>

                    <div className="flex flex-col gap-2 text-sm lg:text-base">
                        {astronotes?.category === 'Textbook' && (
                            <>
                                <h2 className={'font-sans'}>
                                    {astronotes?.authors.join(', ')}
                                </h2>
                                {astronotes?.isbn && (
                                    <h2 className="font-sans text-[#999999]">{`ISBN: ${astronotes?.isbn}`}</h2>
                                )}
                            </>
                        )}
                        {astronotes ? (
                            <>
                                <div className="flex items-center gap-1">
                                    <GrStar className="text-[#999999] w-4 lg:w-5 h-4 lg:h-5" />

                                    <span className="font-sans text-[#999999]">
                                        {astronotes?.rating.toFixed(1)} dari{' '}
                                        {(astronotes?.feedback_total ?? 0) >
                                        10000
                                            ? '10000+'
                                            : astronotes?.feedback_total}{' '}
                                        penilaian
                                    </span>
                                </div>
                            </>
                        ) : (
                            <Skeleton
                                isCustomSize
                                repeat={4}
                                className="w-32 h-4 first:w-48"
                            />
                        )}
                    </div>

                    {astronotes ? (
                        astronotes?.keywords && (
                            <div className="flex justify-center md:justify-start flex-wrap gap-2.5 pt-3 lg:pt-4">
                                {astronotes?.keywords
                                    .split(',')
                                    .map((value) => (
                                        <AstronotesKeyword
                                            keyword={value}
                                            key={value}
                                        />
                                    ))}
                            </div>
                        )
                    ) : (
                        <div className="flex justify-center md:justify-start flex-wrap gap-2.5 pt-3 lg:pt-4">
                            <Skeleton
                                repeat={4}
                                isCustomSize
                                className="w-16 h-6 rounded-full"
                            />
                        </div>
                    )}
                    <StartReadingButton
                        first_problem_id={astronotes?.first_problem_id}
                    />
                </div>
            </div>

            {astronotes?.description && (
                <p className="text-xs text-justify lg:text-sm">
                    {astronotes.description}
                </p>
            )}
        </>
    );
};

export default BookDetails;
