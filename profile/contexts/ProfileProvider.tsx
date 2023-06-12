import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import {
    useGetProfileQuery,
    useUpdateUserMutation
} from 'authentication/redux/api/authApi';
import { capitalize } from 'commons/utils';
import { useRouter } from 'next/router';
import { createContext, ReactNode, useContext, useMemo } from 'react';

interface ProfileContextType {
    updateUser: (data: UpdateUserResponseData) => Promise<
        | {
              data: UpdateUserResponseData;
          }
        | {
              error: FetchBaseQueryError | SerializedError;
          }
    >;
    menuName: string;
    profile: UpdateUserResponseData | undefined;
    isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType>(
    {} as ProfileContextType
);

export const useProfileContext = (): ProfileContextType =>
    useContext(ProfileContext);

interface Props {
    children: ReactNode;
}

export interface ReduxHTTPError {
    error: FetchBaseQueryError | SerializedError;
}

export const ProfileProvider: React.FC<Props> = ({ children }) => {
    const { pathname } = useRouter();
    const [update, { isLoading }] = useUpdateUserMutation();
    const { data: profile } = useGetProfileQuery(
        {},
        { refetchOnMountOrArgChange: true }
    );

    const pathArr = pathname.split('/');
    const menuName = capitalize(
        pathArr[pathArr.length - 1].split('-').join(' ')
    );

    const memoedValue = useMemo(
        () => ({
            updateUser: async (data: UpdateUserResponseData) => {
                const cleanedPayload = {
                    ...data,
                    phone_number: data.phone_number.replace(
                        '+62',
                        ''
                    ) as string,
                    birthdate: data.birthdate.split('T')[0]
                };

                return await update(cleanedPayload);
            },
            menuName,
            profile,
            isLoading
        }),
        [update, menuName, profile, isLoading]
    );

    return (
        <ProfileContext.Provider value={memoedValue}>
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileContext;
