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
    is_profile_complete?: boolean;
}

interface UpdateUserInputData extends ProfileData {
    gender?: 'FEMALE' | 'MALE';
    register_reference_id?: string;
    join_reasoning?: string;
}
