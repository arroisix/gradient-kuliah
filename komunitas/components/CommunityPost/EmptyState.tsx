import AuthContext from 'authentication/contexts/AuthProvider';
import Button from 'commons/components/elements/Button';
import { useKomunitas } from 'komunitas/contexts/KomunitasProvider';
import Image from 'next/image';
import React, { useContext } from 'react';

type EmptyStateProps = {
    setIsShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const EmptyState = ({ setIsShowForm }: EmptyStateProps): JSX.Element => {
    const { profile } = useContext(AuthContext);
    const { detailQuestion } = useKomunitas();

    return (
        <div className="flex flex-col gap-6 p-6 lg:p-10 bg-[#161616] rounded-xl">
            <div className="relative h-[250px]">
                <Image
                    src="https://assets.gradient.academy/assets/empty-answer-community.png"
                    alt="empty-answer-community"
                    layout="fill"
                    className="object-contain"
                />
            </div>
            <div className="flex flex-col items-center gap-[18px]">
                <span className="inline-block font-extrabold">
                    {profile?.username === detailQuestion?.student.username
                        ? 'Pertanyaan ini masih menunggu jawaban'
                        : `${detailQuestion?.student.username} menunggu jawabanmu`}
                </span>
                {!!!(
                    profile?.username === detailQuestion?.student.username
                ) && (
                    <Button
                        variant="custom"
                        className="font-extrabold text-xs bg-[#242424]"
                        onClick={() => setIsShowForm(true)}>
                        Tambahkan Jawaban
                    </Button>
                )}
            </div>
        </div>
    );
};

export default EmptyState;
