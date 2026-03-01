import { api } from "./baseApi";
import { API_VERSION } from "./baseApi";

export const jobApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: (params) => ({
        url: `${API_VERSION}/jobs`,
        method: "GET",
        params: params,
      }),
      providesTags: ["Jobs"],
    }),
    getJobDetail: builder.query({
      query: (id) => `${API_VERSION}/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: "Jobs", id }],
    }),
    createJob: builder.mutation({
      query: (body) => ({
        url: `${API_VERSION}/jobs`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Jobs"],
    }),
    updateJobStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${API_VERSION}/jobs/${id}/status`,
        method: "PUT",
        body: { jobStatus: status },
      }),
      invalidatesTags: ["Jobs"],
    }),
    publishJob: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_VERSION}/jobs/${id}/publish`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Jobs"],
    }),
    updateExpiredDate: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_VERSION}/jobs/${id}/expired-date`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Jobs"],
    }),
    saveJobDraft: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_VERSION}/jobs/${id}/save`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Jobs"],
    }),
    getCriteria: builder.query({
      query: () => `${API_VERSION}/criteria`,
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobDetailQuery,
  useCreateJobMutation,
  useUpdateJobStatusMutation,
  usePublishJobMutation,
  useUpdateExpiredDateMutation,
  useSaveJobDraftMutation,
  useGetCriteriaQuery,
} = jobApi;
