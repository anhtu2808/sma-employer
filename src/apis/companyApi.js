import { api } from "./baseApi";
import { API_VERSION } from "./baseApi";

export const companyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCompanyProfile: builder.query({
            query: () => `${API_VERSION}/recruiter/companies/my-company`,
            providesTags: ['Companies'],
        }),
        updateCompanyProfile: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/recruiter/companies/my-company`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Companies'],
        }),
    }),
});

export const { useGetCompanyProfileQuery, useUpdateCompanyProfileMutation } = companyApi;
