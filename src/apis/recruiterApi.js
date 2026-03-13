import { api } from "./baseApi";
import { API_VERSION } from "./baseApi";

export const recruiterApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRecruiterMembers: builder.query({
            query: () => ({
                url: `${API_VERSION}/recruiter/members`,
                method: 'GET',
            }),
            providesTags: ['Users'],
        }),
        getMyRecruiterInfo: builder.query({
            query: () => ({
                url: `${API_VERSION}/recruiter/me`,
                method: 'GET',
            }),
        }),
        createRecruiterMember: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/recruiter/member`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
        updateRecruiterMember: builder.mutation({
            query: ({ recruiterId, data }) => ({
                url: `${API_VERSION}/recruiter/members/${recruiterId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
        updateRecruiterMemberStatus: builder.mutation({
            query: ({ recruiterId, status }) => ({
                url: `${API_VERSION}/recruiter/members/${recruiterId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Users'],
        }),
        getFeatureUsage: builder.query({
            query: () => ({
                url: `${API_VERSION}/feature-usage`,
                method: 'GET',
            }),
            transformResponse: (response) => response?.data ?? [],
        }),
    }),
});

export const {
    useGetRecruiterMembersQuery,
    useGetMyRecruiterInfoQuery,
    useCreateRecruiterMemberMutation,
    useUpdateRecruiterMemberMutation,
    useUpdateRecruiterMemberStatusMutation,
    useGetFeatureUsageQuery,
} = recruiterApi;
