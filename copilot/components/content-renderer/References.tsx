import { useAuth } from 'authentication/contexts/AuthProvider';
import { cn } from 'commons/utils';
import { CopilotReference } from 'copilot/types/copilot';
import {
    BookOpenIcon,
    ChevronDown,
    FileQuestionMarkIcon,
    FileTypeIcon,
    VideoIcon
} from 'lucide-react';
import Link from 'next/link';
import { Accordion } from 'radix-ui';
import { useState } from 'react';
import { FaListUl } from 'react-icons/fa6';
import { GoArrowUpRight } from 'react-icons/go';

interface ReferencesProps {
    references: CopilotReference[];
}

function References({ references }: ReferencesProps): JSX.Element {
    const [isOpened, setIsOpened] = useState(false);

    return (
        <Accordion.Root
            collapsible
            onValueChange={(v) => setIsOpened(v === 'references')}
            type="single"
            className="w-full max-w-[680px]">
            <Accordion.Item value="references">
                <Accordion.Header>
                    <Accordion.Trigger
                        type="button"
                        className={cn(
                            'bg-gradient-to-b from-black/10 to-[#F2F2F2]/10 py-2 px-4 rounded-full border border-[#333333] text-[#999999] text-sm font-semibold leading-tight flex items-center gap-3'
                        )}>
                        <FaListUl className="shrink-0 text-[#999999] w-4 h-4" />
                        {references.length} Sumber
                        <ChevronDown
                            className={cn(
                                'shrink-0 text-[#999999] w-4 h-4 transition-all',
                                isOpened ? '-rotate-180' : ''
                            )}
                        />
                    </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Content className="animate-fade animate-duration-500 bg-[#191920] p-3 rounded-lg border border-[#4B4E5F] space-y-3 mt-3">
                    {references.map((v) => (
                        <ReferenceItem key={v.title} reference={v} />
                    ))}
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    );
}

interface ReferenceItemProps {
    reference: CopilotReference;
}

function ReferenceItem({ reference }: ReferenceItemProps): JSX.Element {
    const { profile } = useAuth();
    let url = '';

    if (reference.type === 'video') {
        url =
            profile?.current_role === 'COLLEGE_STUDENT'
                ? `/kelas/${reference.subchapter_slug}`
                : `/utbk/materi/${reference.course_slug}/${
                      reference.chapter_slug || '_'
                  }/${reference.subchapter_slug}`;
    }

    if (
        reference.type !== 'video' &&
        reference.book_slug &&
        reference.problem_slug
    ) {
        const bookType =
            reference.type === 'problem_bank'
                ? 'bank-soal'
                : reference.type === 'textbook'
                ? 'textbook'
                : 'astronotes';
        url = `/perpustakaan/${bookType}/${reference.book_slug}/${reference.problem_slug}`;
    }

    return (
        <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                'group flex justify-between items-center',
                !url ? 'pointer-events-none' : ''
            )}>
            <div className="flex items-center gap-2">
                <div className="bg-[#4B4E5F] w-8 h-8 rounded-full grid place-items-center">
                    {reference.type === 'video' ? (
                        <VideoIcon className="shrink-0 w-4 h-4 text-white" />
                    ) : reference.type === 'astronotes' ? (
                        <BookOpenIcon className="shrink-0 w-4 h-4 text-white" />
                    ) : reference.type === 'problem_bank' ? (
                        <FileQuestionMarkIcon className="shrink-0 w-4 h-4 text-white" />
                    ) : (
                        <FileTypeIcon className="shrink-0 w-4 h-4 text-white" />
                    )}
                </div>
                <span className="group-hover:underline transition-all text-white font-medium text-xs leading-tight">
                    {reference.title}
                </span>
            </div>
            <GoArrowUpRight className="text-[#999999] shrink-0 w-4 h-4" />
        </Link>
    );
}

export { References };
