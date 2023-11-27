import moment from 'moment';
import { useRouter } from 'next/router';
import React from 'react';
import { HiPlay } from 'react-icons/hi';

const ListSubchapter = ({
    item,
    onClick
}: {
    item:
        | {
              id: string;
              subchapter_name: string;
              order: string;
              duration: string;
              last_duration: string;
          }
        | SubChapter;
    onClick?: () => void;
}): JSX.Element => {
    const router = useRouter();
    const { id, chapter } = router.query;
    const totalDuration = item?.duration
        ?.split(':')
        ?.reverse()
        ?.reduce((prev, curr, i) => +prev + +curr * +Math.pow(60, i), 0);

    return (
        <div
            key={item.id}
            className="flex justify-between px-3 py-[10px] cursor-pointer bg-[#1D1D1D] hover:bg-[#272727] rounded"
            onClick={() => {
                onClick?.();
                router.push(`/kelas/${id}/belajar/video/${chapter}/${item.id}`);
            }}
            aria-hidden>
            <div className={`w-[80%] flex items-center gap-[10px]`}>
                <div className="w-[18px] h-[18px]">
                    <HiPlay size={18} className="text-[#FFFFFF33]" />
                </div>
                <span className="inline-block overflow-hidden text-xs font-body whitespace-nowrap text-ellipsis">
                    {item.subchapter_name}
                </span>
            </div>
            <div className="flex gap-1 text-xs font-body">
                {item.duration && (
                    <span className="inline-block text-[#FFFFFF80]">
                        {moment
                            .utc((totalDuration as number) * 1000)
                            .format('mm:ss')}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ListSubchapter;
