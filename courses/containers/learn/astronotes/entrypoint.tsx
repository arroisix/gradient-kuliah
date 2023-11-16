import Skeleton from 'commons/components/elements/Skeleton';
import CategoryBookList from 'courses/components/LearningExperience/AstroNotes/CategoryBookList';
import { useGetEntrypointBooksQuery } from 'courses/redux/api/astronotesApi';
import React, { useEffect, useState } from 'react';

const AstronotesEntrypoint = (): JSX.Element => {
    const [booksInProgress, setBooksInProgress] = useState<Astronote[]>([]);
    const { data: astronotes, isLoading } = useGetEntrypointBooksQuery({
        limit: 5
    });

    useEffect(() => {
        if (astronotes) {
            const books = astronotes.reduce<Astronote[]>(
                (inProgress, category) => {
                    const books_ = category.books.filter((b) => b.in_progress);
                    return [...inProgress, ...books_];
                },
                []
            );
            setBooksInProgress(books);
        }
    }, [astronotes]);

    return (
        <div className="px-4 mx-auto space-y-10 md:px-0 max-w-screen-2xl">
            <h1 className="text-4xl font-bold md:text-5xl">Perpustakaan</h1>
            <div className="space-y-4 divide-y divide-neutral-500/30">
                {isLoading ? (
                    <div className="py-4 space-y-6">
                        <Skeleton className="w-1/2" />
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6">
                            <Skeleton
                                repeat={5}
                                className="w-full h-auto aspect-[3/5]"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        {booksInProgress.length > 0 && (
                            <CategoryBookList
                                name="Lanjutkan Membaca"
                                books={booksInProgress}
                            />
                        )}
                        {astronotes?.map(
                            (category: AstronoteBooksByCategory) => {
                                return (
                                    <CategoryBookList
                                        key={category.category_id}
                                        name={category.category_name}
                                        books={category.books}
                                    />
                                );
                            }
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AstronotesEntrypoint;
