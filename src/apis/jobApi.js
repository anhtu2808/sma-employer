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
    }),
});

export const { useGetJobsQuery } = jobApi;
