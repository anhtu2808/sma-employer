import { api } from "./baseApi";
import { API_VERSION } from "./baseApi";
export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        uploadFile: builder.mutation({
            query: (fileData) => ({
                url: `/files/upload`,
                method: 'POST',
                body: fileData,
            }),
        }),
        registerRecruiter: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/recruiter/auth/register`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useRegisterRecruiterMutation, useUploadFileMutation } = authApi;