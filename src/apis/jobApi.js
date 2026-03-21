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
    getMyJobStatusCount: builder.query({
      query: () => ({
        url: `${API_VERSION}/jobs/status-count`,
        method: "GET",
      }),
      providesTags: ["Jobs"],
    }),
    getJobDetail: builder.query({
      query: (id) => `${API_VERSION}/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: "Jobs", id }],
    }),
    createPublishJob: builder.mutation({
      query: (body) => ({
        url: `${API_VERSION}/jobs/publish`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Jobs"],
    }),
    createSaveJobDraft: builder.mutation({
      query: (body) => ({
        url: `${API_VERSION}/jobs/save`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Jobs"],
    }),
    createJobDraft: builder.mutation({
      query: (body) => ({
        url: `${API_VERSION}/jobs/save`,
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
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `${API_VERSION}/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs"],
    }),
    getCriteria: builder.query({
      query: ({ name, page = 0, size = 10 } = {}) => ({
        url: `${API_VERSION}/criteria`,
        method: "GET",
        params: { name, page, size },
      }),
      transformResponse: (response) => response?.data?.content ?? [],
    }),
    getProposedCvs: builder.query({
      query: ({ id, page, size }) => ({
        url: `${API_VERSION}/jobs/${id}/proposed-cv`,
        method: "GET",
        params: { page, size },
      }),
      providesTags: (result, error, { id }) => [{ type: "Jobs", id: `PROPOSED_${id}` }],
    }),
    getResumeDetail: builder.query({
      query: (id) => ({
        url: `${API_VERSION}/resumes/${id}`,
        method: "GET"
      }),
    }),
    inviteCandidate: builder.mutation({
      query: (body) => ({
        url: `${API_VERSION}/invitations`,
        method: "POST",
        body,
      }),
    }),
    getJobQuestions: builder.query({
      query: (params) => ({
        url: `${API_VERSION}/job-questions`,
        method: "GET",
        params: { page: 0, size: 100, deleted: false, ...params },
      }),
      providesTags: ["JobQuestions"],
    }),
    createJobQuestion: builder.mutation({
      query: (body) => ({
        url: `${API_VERSION}/job-questions`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["JobQuestions"],
    }),
    updateJobQuestion: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_VERSION}/job-questions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["JobQuestions"],
    }),
    deleteJobQuestion: builder.mutation({
      query: (id) => ({
        url: `${API_VERSION}/job-questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JobQuestions"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetMyJobStatusCountQuery,
  useGetJobDetailQuery,
  useCreatePublishJobMutation,
  useCreateSaveJobDraftMutation,
  useUpdateJobStatusMutation,
  usePublishJobMutation,
  useUpdateExpiredDateMutation,
  useSaveJobDraftMutation,
  useDeleteJobMutation,
  useGetCriteriaQuery,
  useGetProposedCvsQuery,
  useGetResumeDetailQuery,
  useInviteCandidateMutation,
  useGetJobQuestionsQuery,
  useCreateJobQuestionMutation,
  useUpdateJobQuestionMutation,
  useDeleteJobQuestionMutation,
} = jobApi;
