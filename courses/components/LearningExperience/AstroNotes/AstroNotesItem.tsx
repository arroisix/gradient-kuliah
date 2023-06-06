import { useRouter } from 'next/router';
import { useLearning } from 'courses/contexts/LearningProvider';
import Link from 'next/link';
import { posthog } from 'posthog-js';
import { FaFilePdf, FaLock } from 'react-icons/fa';
import { useAuth } from 'authentication/contexts/AuthProvider';

const MainTitle = ({
    sub,
    astro,
    extraCallback
}: {
    sub: SubChapter;
    astro: Chapter;
    extraCallback?: () => void;
}): JSX.Element => {
    const router = useRouter();
    const { id, notionId } = router.query;
    const { isAuthenticated } = useAuth();
    const { is_subscribed } = useLearning();

    if (sub.notebook?.is_public || isAuthenticated) {
        if (sub.notebook?.notion_id) {
            return (
                <button
                    onClick={() => {
                        posthog.capture(`Click Astronotes Link`, {
                            Subchapter: sub.subchapter_name,
                            Chapter: astro.chapter_name,
                            URL: sub?.notebook?.notebook_url
                        });
                        extraCallback && extraCallback();
                    }}
                    key={sub.id}
                    className={`${
                        notionId === sub.notebook.notion_id &&
                        !router.asPath.includes('#')
                            ? 'text-blue-400 bg-neutral-100'
                            : 'text-neutral-500 '
                    } hover:bg-neutral-100 cursor-pointer flex items-center gap-2 text-left w-full px-2 py-1 rounded-md`}>
                    {sub?.notebook?.is_free ? (
                        <></>
                    ) : is_subscribed ? (
                        <></>
                    ) : (
                        <FaLock />
                    )}
                    <Link
                        href={`/kelas/${id}/astronotes/${sub.notebook?.notion_id}`}>
                        {sub.notebook.title}
                    </Link>
                </button>
            );
        }

        return (
            <a
                onClick={() =>
                    posthog.capture(`Click Astronotes Link`, {
                        Subchapter: sub.subchapter_name,
                        Chapter: astro.chapter_name,
                        URL: sub?.notebook?.notebook_url
                    })
                }
                className={`${
                    notionId === sub?.notebook?.notion_id &&
                    !router.asPath.includes('#')
                        ? 'text-blue-400'
                        : 'text-neutral-500 '
                } hover:underline cursor-pointer flex items-center gap-2 text-left rounded-md`}
                key={sub.id}
                href={sub?.notebook?.notebook_url}>
                <div>
                    {sub?.notebook?.is_free ? (
                        <FaFilePdf />
                    ) : is_subscribed ? (
                        <FaFilePdf />
                    ) : (
                        <FaLock />
                    )}
                </div>
                {sub?.notebook?.title}
            </a>
        );
    }

    return (
        <button
            className={`${
                notionId === sub?.notebook?.notion_id
                    ? 'text-blue-400'
                    : 'text-neutral-500 '
            } hover:underline cursor-pointer flex items-center gap-2 text-left`}
            key={sub.id}
            onClick={() => {
                posthog.capture(`Click Astronotes Link`, {
                    Subchapter: sub.subchapter_name,
                    Chapter: astro.chapter_name,
                    URL: sub?.notebook?.notebook_url
                });
                router.push('/masuk');
            }}>
            <FaFilePdf />
            {sub.subchapter_name}
        </button>
    );
};

const SubTitle = ({
    sub,
    astro,
    subSection,
    extraCallback
}: {
    sub: SubChapter;
    astro: Chapter;
    subSection: NotebookSubSection<string>;
    extraCallback?: () => void;
}): JSX.Element => {
    const router = useRouter();
    const { id } = router.query;
    const { isAuthenticated } = useAuth();
    const { is_subscribed } = useLearning();

    const renderSubTitle = (): JSX.Element => {
        if (sub.notebook?.is_public || isAuthenticated) {
            return (
                <button
                    onClick={() => {
                        posthog.capture(`Click Astronotes Link`, {
                            Subchapter: sub.subchapter_name,
                            Chapter: astro.chapter_name,
                            URL: sub?.notebook?.notebook_url
                        });
                        extraCallback && extraCallback();
                    }}
                    key={sub.id}
                    className={`${
                        router.asPath.includes(subSection.key)
                            ? 'text-blue-400 bg-neutral-100'
                            : 'text-neutral-500 '
                    } cursor-pointer hover:bg-neutral-100 flex items-center gap-2 text-left w-full px-2 py-1 rounded-md`}>
                    {sub?.notebook?.is_free ? (
                        <></>
                    ) : is_subscribed ? (
                        <></>
                    ) : (
                        <FaLock />
                    )}
                    <Link href={`/kelas/${id}/astronotes/${subSection.key}`}>
                        {subSection.title}
                    </Link>
                </button>
            );
        }

        return (
            <button
                className={`${
                    router.asPath.includes(subSection.key)
                        ? 'text-blue-400'
                        : 'text-neutral-500 '
                } hover:underline cursor-pointer flex items-center gap-2 text-left`}
                key={sub.id}
                onClick={() => {
                    posthog.capture(`Click Astronotes Link`, {
                        Subchapter: sub.subchapter_name,
                        Chapter: astro.chapter_name,
                        URL: sub?.notebook?.notebook_url
                    });
                    router.push('/masuk');
                }}>
                <FaFilePdf />
                {subSection.title}
            </button>
        );
    };

    return (
        <div className="pl-4">
            {renderSubTitle()}
            {subSection.sections &&
                subSection.sections.map(
                    (section: NotebookSubSection<string>) => (
                        <SubTitle
                            sub={sub}
                            astro={astro}
                            subSection={section}
                            extraCallback={extraCallback}
                            key={section.key}
                        />
                    )
                )}
        </div>
    );
};

const AstroNotesItem = ({
    astro,
    extraCallback
}: {
    astro: Chapter;
    extraCallback?: () => void;
}): JSX.Element => {
    return (
        <div key={astro.id} className="">
            <div className="flex flex-col gap-2">
                {astro.subchapters.map((sub: SubChapter) => (
                    <div key={sub.id}>
                        <MainTitle
                            sub={sub}
                            astro={astro}
                            extraCallback={extraCallback}
                            key={sub.id}
                        />
                        {sub.notebook?.subsection?.sections.map(
                            (section: NotebookSubSection<string>) => (
                                <SubTitle
                                    sub={sub}
                                    astro={astro}
                                    subSection={section}
                                    extraCallback={extraCallback}
                                    key={sub.id}
                                />
                            )
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AstroNotesItem;
