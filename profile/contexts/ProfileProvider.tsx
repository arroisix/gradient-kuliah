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

export const ProfileProvider: React.FC<Props> = ({ children }) => {
    const { pathname } = useRouter();
    const [update, { isLoading }] = useUpdateUserMutation();
    const { data: profile } = useGetProfileQuery({});

    const pathArr = pathname.split('/');
    const menuName = capitalize(
        pathArr[pathArr.length - 1].split('-').join(' ')
    );

    const memoedValue = useMemo(
        () => ({
            updateUser: async (data: UpdateUserResponseData) =>
                await update(data),
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
