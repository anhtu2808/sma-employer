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
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/auth/forgot-password`,
                method: 'POST',
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/auth/reset-password`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useRegisterRecruiterMutation, useUploadFileMutation, useForgotPasswordMutation, useResetPasswordMutation } = authApi;
export * from "./companyApi";
export * from "./jobApi";
export * from "./recruiterApi";
