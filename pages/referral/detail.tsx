import LearnLayout from 'commons/learnLayout';
import withAuth from 'commons/withAuth';
import ReferralDetailContainer from 'referral/containers/detail';

const ReferralDetail = (): JSX.Element => {
    return (
        <LearnLayout>
            <ReferralDetailContainer />
        </LearnLayout>
    );
};

export default withAuth(ReferralDetail);
