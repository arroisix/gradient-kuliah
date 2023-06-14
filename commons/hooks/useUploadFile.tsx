import axios from 'axios';
import { useUploadFileMutation } from 'commons/redux/api/commonApi';
import { extname } from 'path';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface UploadFileInterface {
    uploadFile: (files: File[]) => Promise<string[] | undefined>;
    isLoading: boolean;
}

const useUploadFile = (bucketKey?: string): UploadFileInterface => {
    const [getTicket, { isLoading: isLoadingTicket }] = useUploadFileMutation();
    const [isLoadingS3, setLoadingS3] = useState(false);

    const uploadFile = async (files: File[]): Promise<string[] | undefined> => {
        if (files.length > 0) {
            const ticket = (await getTicket({
                file_names: files.map(
                    (file: File) =>
                        `${bucketKey}-${file.name.substring(
                            0,
                            3
                        )}-${Date.now()}${extname(file.name)}`
                ),
                bucket_key: bucketKey ?? 'public'
            })) as unknown as SingleResponseData<
                ResponseData<UploadFileResponseData>
            >;

            try {
                setLoadingS3(true);

                ticket?.data?.data?.forEach(
                    async (
                        ticketData: UploadFileResponseData,
                        index: number
                    ) => {
                        const uploadData = new FormData();
                        for (const [key, value] of Object.entries(
                            ticketData.presigned_data.fields
                        )) {
                            uploadData.append(key, value as string);
                        }

                        uploadData.append('file', files[index]);

                        await axios
                            .create()
                            .post(
                                ticketData.presigned_data.upload_url,
                                uploadData,
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }
                            );

                        if (index === ticket.data.data.length - 1) {
                            setLoadingS3(false);
                        }
                    }
                );

                setLoadingS3(false);

                return ticket.data.data.map(
                    (ticketData: UploadFileResponseData) =>
                        `${ticketData.file_url}${ticketData.file_path}`
                );
            } catch (e) {
                toast.error(
                    'Terdapat masalah saat mengupload, mohon coba lagi'
                );
                setLoadingS3(false);
                return;
            }
        }
        return;
    };

    return { uploadFile, isLoading: isLoadingTicket || isLoadingS3 };
};

export default useUploadFile;
