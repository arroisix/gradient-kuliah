import LearnLayout from 'commons/learnLayout';
import withAuth from 'commons/withAuth';
import ReferralContainer from 'referral/containers';

const Referral = (): JSX.Element => {
    return (
        <LearnLayout>
            <ReferralContainer />
        </LearnLayout>
    );
};

export default withAuth(Referral);
