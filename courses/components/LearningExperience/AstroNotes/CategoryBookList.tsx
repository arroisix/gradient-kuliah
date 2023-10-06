import React from 'react';
import AstronoteBook from './AstronoteBook';

type CategoryBookList = {
    name: string;
    books: Astronote[];
};

const CategoryBookList = ({ name, books }: CategoryBookList): JSX.Element => {
    return (
        <div className="py-4 space-y-6">
            <h3 className="font-extrabold">{name}</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6">
                {books.map((book) => (
                    <AstronoteBook key={book.id} {...book} />
                ))}
            </div>
        </div>
    );
};

export default CategoryBookList;
