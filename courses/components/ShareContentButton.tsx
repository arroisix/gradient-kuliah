import Button from 'commons/components/elements/Button';
import { ButtonProps } from 'commons/components/elements/Button/button';
import { cn } from 'commons/utils';
import { Share2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTracker } from 'tracker/tracker';

interface ShareContentButton extends Partial<ButtonProps> {
    shareCopy: string;
    typeCopy: string;
    iconOnly?: boolean;
    iconSize?: number;
}

const ShareContentButton = ({
    shareCopy,
    typeCopy,
    iconOnly,
    iconSize,
    ...props
}: ShareContentButton): JSX.Element => {
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

    if (iconOnly) {
        return (
            <Button
                size="small"
                className={cn(
                    'text-xs w-full flex gap-2 items-center justify-center',
                    props.className
                )}
                {...props}
                onClick={handleCopy}
                variant="custom">
                <Share2Icon size={iconSize ?? 14} />
            </Button>
        );
    }

    return (
        <Button
            size="small"
            {...props}
            className={cn(
                'text-xs w-full flex gap-2 items-center justify-center',
                props.className
            )}
            onClick={handleCopy}
            variant="neutral">
            <Share2Icon size={iconSize ?? 14} />
            Bagikan
        </Button>
    );
};

export default ShareContentButton;
