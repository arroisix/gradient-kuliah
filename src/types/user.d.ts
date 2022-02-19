type User = {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
};

interface AuthenticationPayload {
    payload: User;
    token: string;
    isNewUser?: boolean;
}

interface UpdateUserInputType {
    fullName?: string;
    phoneNumber?: string;
    institution?: string;
    educationLevel?: string;
    birthdate?: string;
    gender?: 'FEMALE' | 'MALE';
    educationLevel?: 'SMP' | 'SMA' | 'SMK' | 'S1' | 'S2';
}
