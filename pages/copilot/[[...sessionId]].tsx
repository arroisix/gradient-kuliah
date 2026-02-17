import { useAuth } from 'authentication/contexts/AuthProvider';
import { Layout } from 'commons/components/Layout';
import LearnLayout from 'commons/learnLayout';
import CopilotContainer from 'copilot/containers/revamp/CopilotContainer';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Copilot = (): JSX.Element => {
    const { profile } = useAuth();
    const router = useRouter();
    const sessionId = router.query.sessionId?.[0];

    if (!profile) {
        return (
            <>
                <Head>
                    <title>Gradient Copilot AI - Asisten Belajar Kamu</title>
                    <meta
                        name="description"
                        content="Gradient Copilot AI adalah asisten belajar berbasis kecerdasan buatan yang dirancang untuk membantu siswa memahami konsep pembelajaran dengan lebih baik, memberikan penjelasan yang mudah dipahami, dan mendukung proses belajar secara interaktif."
                    />
                    <meta
                        name="keywords"
                        content="Gradient Copilot AI, asisten belajar, kecerdasan buatan, penjelasan konsep, interaktif"
                    />
                    <link
                        rel="canonical"
                        href={`https://gradient.academy/copilot`}
                    />
                </Head>
                <LearnLayout fullHeightSidebar>
                    <div className="h-[calc(100vh-128px)]">
                        <CopilotContainer />
                    </div>
                </LearnLayout>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Gradient Copilot AI - Asisten Belajar Kamu</title>
                <meta
                    name="description"
                    content="Gradient Copilot AI adalah asisten belajar berbasis kecerdasan buatan yang dirancang untuk membantu siswa memahami konsep pembelajaran dengan lebih baik, memberikan penjelasan yang mudah dipahami, dan mendukung proses belajar secara interaktif."
                />
                <meta
                    name="keywords"
                    content="Gradient Copilot AI, asisten belajar, kecerdasan buatan, penjelasan konsep, interaktif"
                />
                <link
                    rel="canonical"
                    href={`https://gradient.academy/copilot`}
                />
            </Head>
            <Layout>
                <CopilotContainer sessionId={sessionId} />
            </Layout>
        </>
    );
};

export default Copilot;
