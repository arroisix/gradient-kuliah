interface LegalPageData {
    lastUpdatedDate: string;
    title: string;
    contents: LegalContent[];
}

interface LegalContent {
    heading: string;
    content: string;
}

type LegalTocProps = {
    headings: string[];
} & PropsWithClassName;
