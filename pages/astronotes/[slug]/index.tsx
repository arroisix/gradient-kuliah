import { GetServerSideProps } from 'next';
import LearnLayout from 'commons/learnLayout';
import AstronotesDetail from 'courses/containers/learn/astronotes/detail';
import { wrapper } from 'redux/store';
import { getBookDetail } from '../../../courses/redux/api/astronotesApi';
import { getRunningQueriesThunk } from '../../../redux/api/baseApi';
import { ThunkDispatch } from 'redux-thunk';

const AstronotesDetailPage = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <AstronotesDetail />
        </LearnLayout>
    );
};

AstronotesDetailPage.displayName = 'Book Detail';
export default AstronotesDetailPage;

export const getServerSideProps: GetServerSideProps =
    wrapper.getServerSideProps((store) => async ({ params }) => {
        (store.dispatch as ThunkDispatch<RootState, any, any>)(
            getBookDetail.initiate({ slug: params?.slug as string })
        );

        await Promise.all(
            (store.dispatch as ThunkDispatch<RootState, any, any>)(
                getRunningQueriesThunk()
            )
        );

        return {
            props: {}
        };
    });
