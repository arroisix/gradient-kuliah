import LearnLayout from "commons/learnLayout"
import AstronotesEntrypoint from "courses/containers/learn/astronotes/entrypoint"
import { GetStaticProps } from "next"

const BankSoalPage = (): JSX.Element => {
    return (
        <LearnLayout showSidebar fullHeightSidebar>
            <AstronotesEntrypoint />
        </LearnLayout>
    )
}

export const getStaticProps: GetStaticProps = () => {
    const META_TITLE =
        'Kumpulan Bank Soal Perkuliahan Terbaru | Gradient ';
    const META_DESCRIPTION =
        'Kumpulan latihan soal terlengkap dengan pembahasan mendetail memberikan solusi yang mudah dipahami dan mulailah belajar dengan cara yang menyenangkan dan interaktif.';

    return {
        props: {
            canonical: 'https://gradient.academy/perpustakaan/bank-soal',
            title: META_TITLE,
            description: META_DESCRIPTION,
            openGraph: {
                type: 'website',
                title: META_TITLE,
                description: META_DESCRIPTION,
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
        }
    }
}

BankSoalPage.displayName = 'Question Bank Library';
export default BankSoalPage;