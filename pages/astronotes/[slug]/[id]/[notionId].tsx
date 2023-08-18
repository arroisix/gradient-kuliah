import LearnLayout from 'commons/learnLayout';
import AstronoteDetail from 'courses/containers/learn/astronotes/detail';
import notionClient from 'library/notion/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ExtendedRecordMap } from 'notion-types';
import { wrapper } from 'redux/store';

const AstroNotes = ({
    notes
}: {
    notes: ExtendedRecordMap | null;
}): JSX.Element => {
    return (
        <LearnLayout>
            <AstronoteDetail notes={notes} />
        </LearnLayout>
    );
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
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
