import Button from 'commons/components/elements/Button';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

type EmptyStateProps = {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    isOnSearch: boolean;
};

const EmptyState = ({
    setShowForm,
    isOnSearch
}: EmptyStateProps): JSX.Element => {
    const { pathname } = useRouter();

    return (
        <div className="flex flex-col gap-6 pt-6">
            <div className="relative h-[250px]">
                <Image
                    src={
                        isOnSearch
                            ? 'https://assets.gradient.academy/assets/empty-search-community.png'
                            : pathname === '/komunitas'
                            ? 'https://assets.gradient.academy/assets/empty-explore-community.png'
                            : 'https://assets.gradient.academy/assets/empty-my-question-community.png'
                    }
                    alt={
                        isOnSearch
                            ? 'empty-search-community'
                            : pathname === '/komunitas'
                            ? 'empty-explore-community'
                            : 'empty-my-question-community'
                    }
                    layout="fill"
                    className="object-contain"
                />
            </div>
            <div className="flex flex-col items-center gap-[18px]">
                {isOnSearch ? (
                    <span className="inline-block font-extrabold">
                        Tidak ada yang cocok
                    </span>
                ) : pathname === '/komunitas' ? (
                    <>
                        <span className="inline-block font-extrabold">
                            Belum ada postingan
                        </span>
                        <Button
                            variant="primary"
                            className="text-xs font-extrabold"
                            onClick={() => setShowForm(true)}>
                            Mulai Post
                        </Button>
                    </>
                ) : (
                    <>
                        <span className="inline-block font-extrabold">
                            Kamu belum pernah menanyakan apapun
                        </span>
                        <Button
                            variant="custom"
                            className="font-extrabold text-xs bg-[#242424]"
                            onClick={() => setShowForm(true)}>
                            Mulai Bertanya
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EmptyState;
