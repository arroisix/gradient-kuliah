import { useGetBookContentQuery } from 'courses/redux/api/courseApi';
import { useRouter } from 'next/router';
import { useAuth } from 'authentication/contexts/AuthProvider';
import { FaLock } from 'react-icons/fa';
import LoadingBackdrop from 'commons/components/elements/LoadingBackdrop';
import useTransition from 'commons/hooks/useTransition';
import useCourseSubscription from 'courses/hooks/useCourseSubscription';

const SubTitle = ({
    value,
    extraCallback
}: {
    value: {
        key: string;
        title: string;
    };
    extraCallback?: () => void;
}): JSX.Element => {
    const router = useRouter();
    const { slug, id } = router.query;

    return (
        <button
            onClick={() => {
                extraCallback && extraCallback();
                router.push(`/astronotes/${slug}/${id}/${value.key}`);
            }}
            key={value.key}
            className={`${
                router.asPath.includes(value.key)
                    ? 'text-blue-400 bg-neutral-100'
                    : 'text-neutral-500 '
            } cursor-pointer hover:bg-neutral-100 flex items-center gap-2 text-left w-full pl-6 pr-2 py-1 rounded-md`}>
            {value.title}
        </button>
    );
};

export const AstroNotesItem = ({
    astro,
    extraCallback,
    book
}: {
    astro: BookChapter;
    extraCallback?: () => void;
    book: BookContent;
}): JSX.Element => {
    const router = useRouter();
    const { slug, id, notionId } = router.query;
    const { isAuthenticated } = useAuth();
    const { is_subscribed } = useCourseSubscription(slug as string);

    if (book?.is_public || isAuthenticated) {
        return (
            <div key={astro.id}>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => {
                            extraCallback && extraCallback();
                            router.push(
                                `/astronotes/${slug}/${id}/${astro.notion_id}`
                            );
                        }}
                        key={astro.id}
                        className={`${
                            notionId === astro.notion_id &&
                            !router.asPath.includes('#')
                                ? 'text-blue-400 bg-neutral-100'
                                : 'text-neutral-500 '
                        } hover:bg-neutral-100 cursor-pointer flex items-center gap-2 text-left w-full px-2 py-1 rounded-md`}>
                        {book.is_free ? (
                            <></>
                        ) : is_subscribed ? (
                            <></>
                        ) : (
                            <FaLock />
                        )}
                        {astro.title}
                    </button>
                    {astro.subsection.sections.map((value) => (
                        <SubTitle
                            key={value.key}
                            value={value}
                            extraCallback={extraCallback}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div key={astro.id} className="">
            <div className="flex flex-col gap-2">locked</div>
        </div>
    );
};

const AstronoteHome = (): JSX.Element => {
    const router = useRouter();
    const { slug, id } = router.query;
    const { data, isLoading } = useGetBookContentQuery(
        {
            slug: slug as string,
            book_id: id as string
        },
        { skip: !slug || !id }
    );
    const loadingTransition = useTransition(router);

    const renderNotebook = (): JSX.Element => {
        if (isLoading) {
            return (
                <div className="w-full flex flex-col gap-4">
                    <div className="w-full flex flex-col gap-2">
                        <div className="p-4 w-72 bg-neutral-600 animate-pulse rounded-md" />
                        <div className="p-2 w-64 bg-neutral-600 animate-pulse rounded-md" />
                        <div className="p-2 w-64 bg-neutral-600 animate-pulse rounded-md" />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <div className="p-4 w-72 bg-neutral-600 animate-pulse rounded-md" />
                        <div className="p-2 w-64 bg-neutral-600 animate-pulse rounded-md" />
                        <div className="p-2 w-64 bg-neutral-600 animate-pulse rounded-md" />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <div className="p-4 w-72 bg-neutral-600 animate-pulse rounded-md" />
                        <div className="p-2 w-64 bg-neutral-600 animate-pulse rounded-md" />
                        <div className="p-2 w-64 bg-neutral-600 animate-pulse rounded-md" />
                    </div>
                </div>
            );
        }

        return (
            <>
                {data?.book.chapters?.map((astro: BookChapter) => (
                    <AstroNotesItem
                        astro={astro}
                        key={astro.id}
                        book={data.book}
                    />
                ))}
            </>
        );
    };

    return (
        <section className="pt-[65px] min-h-[100vh] flex flex-col md:flex-row relative md:overflow-x-hidden overflow-y-auto md:h-[100vh] bg-white">
            <div className="md:px-32 md:py-8 p-4 w-full">
                <div className="flex flex-col gap-4 mb-4">
                    <h1 className="text-2xl md:text-4xl font-bold break-word flex gap-1 items-center text-black">
                        {isLoading ? (
                            <div className="p-4 w-64 bg-neutral-600 animate-pulse rounded-lg" />
                        ) : (
                            data?.book.title
                        )}
                    </h1>
                    <h3 className="text-neutral-400">Oleh Gradient</h3>
                    <div className="w-full h-px bg-neutral-400" />
                </div>
                <div className="flex flex-col gap-4 pb-32">
                    {renderNotebook()}
                </div>
            </div>
            {loadingTransition && <LoadingBackdrop />}
        </section>
    );
};

export default AstronoteHome;
