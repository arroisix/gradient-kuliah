import clsx from 'clsx';
import useUploadFile from 'commons/hooks/useUploadFile';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { IoMdClose } from 'react-icons/io';

const AttachmentForm = ({
    attachmentNames: attachmentName,
    attachmentUrl: attachmentUrls,
    setAttachmentNames: setAttachmentName,
    setAttachmentUrl: setAttachmentUrls,
    bucketKey
}: {
    attachmentUrl: string[];
    setAttachmentUrl: Dispatch<SetStateAction<string[]>>;
    attachmentNames: string[];
    setAttachmentNames: Dispatch<SetStateAction<string[]>>;
    bucketKey?: string;
}): JSX.Element | null => {
    const { uploadFile } = useUploadFile(bucketKey);

    async function handleInputFile(
        event: ChangeEvent<HTMLInputElement>
    ): Promise<void> {
        const files: File[] = [];

        if (event.target.files) {
            for (let i = 0; i < event?.target?.files.length; ++i) {
                const file = event?.target?.files[i];

                files.push(file);
                setAttachmentName([file.name, ...attachmentName]);
            }
        }
        const res = await uploadFile(files);
        if (res) {
            setAttachmentUrls([...res, ...attachmentUrls]);
        }
    }

    return (
        <div
            className={clsx(
                'flex gap-3 flex-wrap',
                attachmentUrls.length == 0 && 'hidden'
            )}>
            <input
                type="file"
                id={'inputFile'}
                hidden
                multiple
                accept={'image/png,image/gif,image/jpeg,image/jpg'}
                onChange={handleInputFile}
            />
            {attachmentName.map((value, index) => (
                <div
                    key={index}
                    className="relative px-[10px] py-[6px] text-[10px] font-body bg-[#272727] rounded-[4px]">
                    <span
                        className="inline-block"
                        onClick={() => window.open(attachmentUrls[index])}
                        aria-hidden>
                        {value}
                    </span>
                    <div
                        className="absolute top-[-5px] right-[-5px] w-[15px] h-[15px] bg-[#373737] rounded-full flex justify-center items-center cursor-pointer"
                        onClick={() => {
                            setAttachmentName((prev) =>
                                prev.filter((item, id) => id !== index)
                            );
                            setAttachmentUrls((prev) =>
                                prev.filter((item, id) => id !== index)
                            );
                        }}
                        aria-hidden>
                        <IoMdClose className="text-neutral-400" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttachmentForm;
