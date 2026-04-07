import { api } from "./baseApi";
import { API_VERSION } from "./baseApi";

export const companyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCompanies: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/companies`,
                method: 'GET',
                params,
            }),
            transformResponse: (response) => {
                if (Array.isArray(response?.data)) return response.data;
                if (Array.isArray(response?.data?.content)) return response.data.content;
                if (Array.isArray(response?.data?.items)) return response.data.items;
                if (Array.isArray(response)) return response;
                return [];
            },
            providesTags: ['Companies'],
        }),
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

        // --- BLACKLIST ENDPOINTS ---
        getBlacklist: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/company/blacklist`,
                method: 'GET',
                params: params,
            }),
            providesTags: ['Blacklist'],
        }),
        blockCandidate: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/company/blacklist`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Blacklist', 'Applications'],
        }),
        unblockCandidate: builder.mutation({
            query: (candidateId) => ({
                url: `${API_VERSION}/company/blacklist/${candidateId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Blacklist'],
        }),
    }),
});

export const {
    useGetCompaniesQuery,
    useGetCompanyProfileQuery,
    useUpdateCompanyProfileMutation,
    useGetCompanyLocationQuery,
    useGetBlacklistQuery,
    useBlockCandidateMutation,
    useUnblockCandidateMutation
} = companyApi;
