import React from 'react';
import Skeleton from './../../../commons/components/elements/Skeleton';
import Button from 'commons/components/elements/Button';
import ProgressItem from './ProgressItem';
import { cn } from 'commons/utils';
import { useGetClassProgressQuery } from 'dashboard/redux/api/dashboardApi';

type AccordionItemProps = {
    toggleAccordion: (slug: string, name: string) => void;
    slug: string;
    name: string;
    isOpen: boolean;
    isEditing: boolean;
};

const AccordionItem = ({
    isOpen,
    slug,
    name,
    isEditing,
    toggleAccordion
}: AccordionItemProps): JSX.Element => {
    const { data, isFetching } = useGetClassProgressQuery(
        { slug },
        { skip: !isOpen }
    );

    return (
        <label
            key={slug}
            className={cn(
                isEditing && 'hidden',
                'rounded-lg collapse collapse-arrow bg-neutral-800'
            )}>
            <input
                type="checkbox"
                name="kelasku"
                onChange={() => toggleAccordion(slug, name)}
                checked={isOpen}
                className="min-h-0"
            />
            <div className="!px-4 !py-3 font-bold collapse-title min-h-fit md:!py-4 md:!px-5 collapse-arrow">
                {name}
            </div>
            <div className="collapse-content">
                <div
                    className={cn(
                        'grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3 lg:grid-rows-1',
                        {
                            'grid-rows-2': data?.class_progress.length == 2,
                            'grid-rows-3': data?.class_progress.length == 3
                        }
                    )}>
                    {!isFetching ? (
                        data?.class_progress.map((progress) => (
                            <ProgressItem
                                key={progress.id}
                                progress={progress}
                                courseName={name}
                            />
                        ))
                    ) : (
                        <Skeleton repeat={3} className="h-36 !mb-0" />
                    )}
                </div>
                <Button
                    variant="custom"
                    href={`/kelas/${slug}`}
                    eventName='User click "Lihat Kelas" Button on Accordion'
                    eventPayload={{ Course: name }}
                    className="w-full text-xs text-center text-black bg-white">
                    Lihat Kelas
                </Button>
            </div>
        </label>
    );
};

export default AccordionItem;
