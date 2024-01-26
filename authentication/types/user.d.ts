type User = {
    id: string;
    email: string;
    full_name: string;
    phone_number: string;
    photo_profile: string;
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
    is_profile_complete: boolean;
}

interface UpdateUserResponseData {
    gender: string;
    user_id: string;
    full_name: string;
    email: string;
    phone_number: string;
    username: string;
    birthdate: string;
    education_level: 'SMP' | 'SMA' | 'SMK' | 'S1' | 'S2' | 'S3';
    institution: string;
    major: string;
    profession: 'student' | 'employed' | 'unemployed' | 'fresh_grad';
    profession_field: string;
    photo_profile: string;
    is_profile_complete: boolean;
    device_type_id: number;
    device_allowed: boolean;
}

interface UpdateGeneralProfileInputData extends UpdateUserResponseData {
    photo_profile_file?: FileList;
}

interface UpdateUserInputData extends Partial<UpdateUserResponseData> {
    register_reference_id?: string;
    join_reasoning?: string;
}

interface CheckUsernameAvailabilityInputData {
    username: string;
}

interface CheckUsernameAvailabilityResponseData {
    is_available: boolean;
}

interface CheckUsernameAvailabilityResponse {
    data: CheckUsernameAvailabilityResponseData;
}

interface DeviceTypeResponse {
    id: number;
    name: string;
    max_count: number;
}

interface UserDeviceResponse {
    id: number;
    ip_address: string;
    last_login: string;
    device_type_id: number;
    device_allowed: boolean;
}

interface Institution {
    name: string;
    abbreviation: string;
}

interface Major {
    name: string;
    abbreviation: string;
}