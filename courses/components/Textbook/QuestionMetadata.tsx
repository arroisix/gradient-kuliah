import Skeleton from 'commons/components/elements/Skeleton';
import React from 'react';
import { BiBookBookmark } from 'react-icons/bi';
import { FaRegListAlt } from 'react-icons/fa';
import { GrDocument } from 'react-icons/gr';

export const QuestionMetadata = ({
    problem
}: Partial<Pick<TextbookSolution, 'problem'>>): JSX.Element => {
    const iconClassname = 'inline w-4 h-4 mr-1';
    const metadata = [
        {
            id: 'chapter',
            icon: <BiBookBookmark className={iconClassname} />,
            data: problem?.chapter
        },
        {
            id: 'section',
            icon: <FaRegListAlt className={iconClassname} />,
            data: problem?.section
        },
        {
            id: 'page',
            icon: <GrDocument className={iconClassname} />,
            data: problem?.page_number && `Page ${problem?.page_number}`
        }
    ];
    return (
        <div className="space-y-3 font-body">
            {problem ? (
                <h1 className="text-xl font-bold">{problem?.title}</h1>
            ) : (
                <Skeleton isCustomSize className="w-32 h-5" />
            )}
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                {problem
                    ? metadata.map((item) =>
                          item.data ? (
                              <p
                                  key={item.id}
                                  className="text-xs text-neutral-500">
                                  {item.icon} {item.data}
                              </p>
                          ) : (
                              <></>
                          )
                      )
                    : metadata.map((item) => (
                          <div
                              key={item.id}
                              className="flex items-center text-xs text-neutral-500">
                              {item.icon}
                              <Skeleton isCustomSize className="w-16 h-3" />
                          </div>
                      ))}
            </div>
        </div>
    );
};
