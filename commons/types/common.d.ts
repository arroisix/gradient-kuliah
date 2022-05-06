type GradientObject = {
    [key: string | number]: string | number | string[] | number[] | any;
};

interface SingleResponseData<T> {
    data: T;
}

interface ResponseData<T> {
    data: T[];
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
