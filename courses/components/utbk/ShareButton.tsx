import Button from 'commons/components/elements/Button';
import { IoMdShareAlt } from 'react-icons/io';
import { toast } from 'react-toastify';
import { useTracker } from 'tracker/tracker';

interface ShareButtonProps {
    typeCopy: string;
    shareCopy: string;
    disabled?: boolean;
}

function ShareButton({
    typeCopy,
    shareCopy,
    disabled
}: ShareButtonProps): JSX.Element {
    const tracker = useTracker();

    function handleCopy(): void {
        if (typeof window !== 'undefined') {
            const finalShareCopy = `${shareCopy}\nLink: ${window.location.href} \n`;

            navigator.clipboard.writeText(finalShareCopy);
            toast.success('Link berhasil disalin', {
                theme: 'colored'
            });

            tracker?.trackButtonClick(
                `Click Share Button ${typeCopy}`,
                'Bagikan',
                {
                    type: typeCopy,
                    share: finalShareCopy,
                    link: window.location.href
                }
            );
        }
    }

    return (
        <Button
            disabled={disabled}
            onClick={handleCopy}
            variant="neutral"
            size="small"
            className="group flex-shrink flex items-center gap-1.5 text-sm !p-2 lg:!py-2 lg:!px-4">
            <IoMdShareAlt className="fill-white w-4 h-4 group-disabled:fill-neutral-300/30" />
            <span className="hidden lg:block">Bagikan</span>
        </Button>
    );
}

export { ShareButton };
