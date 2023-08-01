import LearnLayout from 'commons/learnLayout';
import withAuth from 'commons/withAuth';
import ReferalDetailContainer from 'referal/containers/detail';

const ReferalDetail = (): JSX.Element => {
    return (
        <LearnLayout>
            <ReferalDetailContainer />
        </LearnLayout>
    );
};

export default withAuth(ReferalDetail);
