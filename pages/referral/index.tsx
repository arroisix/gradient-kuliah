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

Referral.displayName = 'Referral';
export default withAuth(Referral);
