import Button from 'commons/components/elements/Button';

import { ChangeEventHandler, FocusEventHandler } from 'react';

import { MdInsertPhoto } from 'react-icons/md';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { getCurrentUser } from 'authentication/redux/selectors/userSelector';
import { generateInitial } from 'commons/utils';

interface QnaFormInputData {
    content: string;
    attachment?: string;
}

const QnaTextArea = ({
    values,
    handleChange,
    handleBlur,
    onCancel,
    avatarSize,
    disabled
}: {
    values: QnaFormInputData;
    handleChange: ChangeEventHandler;
    handleBlur: FocusEventHandler;
    onCancel: () => void;
    avatarSize?: string;
    disabled: boolean;
}): JSX.Element => {
    const user = useSelector(getCurrentUser);

    return (
        <>
            <div>
                <div
                    className={`${
                        avatarSize ?? 'h-[60px] w-[60px]'
                    } bg-neutral-800 rounded-full overflow-hidden flex justify-center items-center`}>
                    <span className="font-bold md:text-xl">
                        {generateInitial(user.full_name)}
                    </span>
                </div>
            </div>
            <div className="flex flex-col w-full gap-2">
                <TextareaAutosize
                    value={values.content}
                    name="content"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Punya pertanyaan terkait materi?"
                    className="bg-transparent transition-all resize-none w-full border-t-0 border-x-0 border-b border-b-neutral-600 focus:border-t-0 focus:border-x-0 focus:border-b-white focus:ring-0"
                />
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <MdInsertPhoto className="text-2xl text-neutral-400 cursor-pointer hover:text-white" />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="custom"
                            size="extraSmall"
                            type="button"
                            onClick={onCancel}>
                            Batal
                        </Button>
                        <Button
                            disabled={disabled}
                            variant="primary"
                            size="extraSmall"
                            type="submit">
                            Kirim
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QnaTextArea;
