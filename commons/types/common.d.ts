type GradientObject = {
    [key: string | number]: string | number | string[] | number[] | any;
};

interface SingleResponseData<T> {
    data: T;
}

interface ResponseData<T> {
    data: T[];
}

interface BaseListQueryParams {
    page?: int;
    limit?: int;
    keyword?: string;
}

interface ListResponseData<T> {
    count_items: number;
    previous_page: number;
    next_page: number;
    data: T[];
}

type GradientError = {
    errors: {
        code: string;
        error_message: string;
        validation_error: GradientObject;
    };
};

interface UploadFileInputData {
    file_names: string[];
    bucket_key: string;
}

interface UploadFileResponseData {
    file_name: string;
    file_url: string;
    file_extension: string;
    file_path: string;
    presigned_data: {
        upload_url: string;
        fields: {
            'Content-Type': string;
            acl: 'public-read';
            key: string;
            AWSAccessKeyId: string;
            policy: string;
            signature: string;
        };
    };
}

type BaseInfiniteScrollHook<T> = {
    allData?: ListResponseData<T>;
    isAllLoading: boolean;
    isLoading: boolean;
    anchor: React.MutableRefObject<HTMLDivElement>;
    loadMore?: () => void;
};

interface GradientBaseComponentWithSlug {
    slug: string;
}

interface GradientBaseComponentWithId {
    id: string;
}

interface GradientBaseComponentWithData<T> {
    data: T;
}

interface ConfigResponse {
    configs: {
        [key: string]: object;
    };
}

type BreadcrumbPathnames =
    | '/kelas'
    | '/komunitas/public'
    | '/perpustakaan'
    | '/perpustakaan/astronotes'
    | '/perpustakaan/astronotes/[slug]'
    | '/perpustakaan/textbook'
    | '/perpustakaan/textbook/[slug]'
    | '/perpustakaan/bank-soal'
    | '/tentang-kami'
    | '/kebijakan-privasi'
    | '/syarat-dan-ketentuan';

type BreadcrumbProps = {
    [key in BreadcrumbPathnames]: BreadcrumbItemProps;
};

type BreadcrumbItemProps = {
    name: string;
    url?: string;
    nextItem?: BreadcrumbItemProps;
};
