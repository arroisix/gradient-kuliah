import LearnLayout from 'commons/learnLayout';
import withAuth from 'commons/withAuth';
import ReferalContainer from 'referal/containers';

const Referral = (): JSX.Element => {
    return (
        <LearnLayout>
            <ReferalContainer />
        </LearnLayout>
    );
};

export default withAuth(Referral);
