type User = {
    id: string;
    email: string;
    full_name: string;
    phone_number: string;
};

type RegisterReference = {
    id: string;
    name: string;
};

interface AuthInputData {
    email: string;
    password: string;
}

interface SocialAuthInputData {
    provider: 'google' | 'facebook';
    access_token: string;
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
    education_level?: 'SMP' | 'SMA' | 'SMK' | 'S1' | 'S2' | 'S3';
    register_reference_id?: string;
    major?: string;
    join_reasoning?: string;
}

interface ProfileData {
    full_name?: string;
    email: string;
    phone_number?: string;
    username?: string;
    birthdate?: string;
    education_level: 'SMP' | 'SMA' | 'SMK' | 'S1' | 'S2' | 'S3';
    institution?: string;
    major?: string;
    profession?: 'student' | 'employed' | 'unemployed' | 'fresh_grad';
    profession_field?: string;
    photo_profile?: string;
}
