import LearnLayout from 'commons/learnLayout';
import withAuth from 'commons/withAuth';
import { GetStaticProps } from 'next';
import ReferralContainer from 'referral/containers';

const Referral = (): JSX.Element => {
    return (
        <LearnLayout>
            <ReferralContainer />
        </LearnLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            title: 'Ajak teman ke Gradient dan dapatkan cashback 25K',
            description:
                'Ajak teman kamu berlangganan di Gradient dan kamu akan mendapatkan cashback sebesar Rp25.000 untuk tiap teman kamu yang berlangganan dengan kode referral kamu.',
            openGraph: {
                type: 'website',
                title: 'Ajak teman ke Gradient dan dapatkan cashback 25K',
                description:
                    'Ajak teman kamu berlangganan di Gradient dan kamu akan mendapatkan cashback sebesar Rp25.000 untuk tiap teman kamu yang berlangganan dengan kode referral kamu.',
                url: `https://gradient.academy`,
                images: [
                    {
                        url: 'https://assets.gradient.academy/assets/gradient-G-icon.png',
                        width: 48,
                        height: 48,
                        alt: 'Gradient Academy'
                    }
                ]
            }
        },
        revalidate: 60
    };
};

Referral.displayName = 'Referral';
export default withAuth(Referral);
