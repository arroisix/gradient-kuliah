import { LearningProvider } from 'courses/contexts/LearningProvider';
import LearnLayout from 'commons/learnLayout';
import { GetStaticProps, GetStaticPaths } from 'next';
import { wrapper } from 'redux/store';
import notionClient from 'library/notion/client';
import { ExtendedRecordMap } from 'notion-types';
import config from 'redux/api/config';
import LearnAstroNotes from 'courses/containers/learn/astronotes/learnAstroNotes';

export const customMapPageUrl =
    (rootPageId: string, notionId: string) => () => {
        return `/kelas/${rootPageId}/astronotes/${notionId}`;
    };

const AstroNotes = ({
    notes,
    id,
    notionId
}: {
    notes: ExtendedRecordMap | null;
    notionId: string;
    id: string;
}): JSX.Element => {
    return (
        <LearningProvider>
            <LearnLayout lightMode>
                <LearnAstroNotes notes={notes} notionId={notionId} id={id} />
            </LearnLayout>
        </LearningProvider>
    );
};

const fetchNotebookSlug = async (): Promise<
    ResponseData<NotebookSlugResponse>
> => {
    const res = await fetch(
        `${config.API_BASE_URL}courses/public/notebook/slug/`
    );

    return (await res.json()) as ResponseData<NotebookSlugResponse>;
};

export const getStaticPaths: GetStaticPaths = async () => {
    const notionSlugs = await fetchNotebookSlug();

    const paths = notionSlugs.data.map((data: NotebookSlugResponse) => ({
        params: {
            id: data.courseSlug,
            notionId: data.notionId
        }
    }));

    return {
        paths,
        fallback: 'blocking'
    };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
    () =>
        async ({ params }) => {
            // Call an external API endpoint to get posts
            let page = null;

            try {
                page = await notionClient.getPage(params?.notionId as string);
            } catch (error) {}

            return {
                props: {
                    notes: page,
                    ...params
                },
                revalidate: 300
            };
        }
);

export default AstroNotes;
