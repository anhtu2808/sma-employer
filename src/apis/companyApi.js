import { api } from "./baseApi";
import { API_VERSION } from "./baseApi";

export const companyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCompanyProfile: builder.query({
            query: () => `${API_VERSION}/companies/my-company`,
            providesTags: ['Companies'],
        }),
        updateCompanyProfile: builder.mutation({
            query: ({ id, data }) => ({
                url: `${API_VERSION}/companies/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Companies'],
        }),
        getCompanyLocation: builder.query({
            query: () => ({
                url: `${API_VERSION}/companies/locations`,
                method: 'GET',
            }),
            transformResponse: (response) => response?.data ?? [],
        }),
    }),
});

export const { useGetCompanyProfileQuery, useUpdateCompanyProfileMutation, useGetCompanyLocationQuery } = companyApi;
