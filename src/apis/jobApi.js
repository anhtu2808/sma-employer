import { api } from "./baseApi";
import { API_VERSION } from "./baseApi";

export const jobApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getJobs: builder.query({
            query: (params) => ({
                url: `${API_VERSION}/jobs`,
                method: 'GET',
                params: params,
            }),
            providesTags: ['Jobs'],
        }),
        getJobDetail: builder.query({
            query: (id) => `${API_VERSION}/jobs/${id}`,
            providesTags: (result, error, id) => [{ type: 'Jobs', id }],
        }),
        createJob: builder.mutation({
            query: (body) => ({
                url: `${API_VERSION}/jobs`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Jobs'],
        }),
    }),
});

export const { useGetJobsQuery, useGetJobDetailQuery, useCreateJobMutation } = jobApi;
