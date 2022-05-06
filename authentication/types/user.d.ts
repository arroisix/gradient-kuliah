type User = {
    id: string;
    email: string;
    full_name: string;
    phone_number: string;
};

interface LoginInputData {
    email: string;
    password: string;
}

interface SocialLoginInputData {
    provider: 'google' | 'facebook';
    access_token: string;
}

interface RegisterInputData extends LoginInputData {
    full_name: string;
}

interface LoginResponseData {
    user: User;
    token: string;
    is_new_user?: boolean;
}

interface UpdateUserInputData {
    full_name?: string;
    phone_number?: string;
    institution?: string;
    education_level?: string;
    birthdate?: string;
    gender?: 'FEMALE' | 'MALE';
    education_level?: 'SMP' | 'SMA' | 'SMK' | 'S1' | 'S2';
}
