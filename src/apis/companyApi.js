import { api } from "./baseApi";
import { API_VERSION } from "./baseApi";

export const companyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCompanyProfile: builder.query({
            query: () => `${API_VERSION}/company`,
            providesTags: ['Companies'],
        }),
        updateCompanyProfile: builder.mutation({
            query: (id, data) => ({
                url: `${API_VERSION}/company/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Companies'],
        }),
    }),
});

export const { useGetCompanyProfileQuery, useUpdateCompanyProfileMutation } = companyApi;
