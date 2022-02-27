import IdyllDocument from 'idyll-document';
import * as components from 'idyll-components';

const LearnNotebook = ({ notebook }: { notebook: Notebook }): JSX.Element => {
    console.log(notebook);

    return (
        <div className="w-full h-full pb-48">
            <div className="mb-4 border-b border-neutral-600">
                <h3 className="text-4xl font-bold mb-4">{notebook.title}</h3>
                <p className="text-base text-neutral-600 mb-4">
                    Oleh {notebook.authors[0].name}
                </p>
            </div>
            <div className="min-h-[50vh]">
                <IdyllDocument
                    markup={notebook.content}
                    components={components}
                    datasets={{}}
                />
            </div>
            <div className="border-b border-neutral-600 my-4" />
            <div className="mb-16">
                <h5 className="text-2xl font-bold mb-4">
                    Referensi (APA Style)
                </h5>
                {notebook.references.split('||').map((reference) => (
                    <p
                        className="text-base my-2 text-neutral-400"
                        key={reference}>
                        {reference}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default LearnNotebook;
