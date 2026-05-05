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
      invalidatesTags: ["Jobs", "FeatureUsage"],
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
      invalidatesTags: ["Jobs", "FeatureUsage"],
    }),
    publishJob: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_VERSION}/jobs/${id}/publish`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Jobs", "FeatureUsage"],
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
      providesTags: ["Criteria"],
    }),
    getCriteriaPaginated: builder.query({
      query: ({ name, active, page = 0, size = 10 } = {}) => ({
        url: `${API_VERSION}/criteria`,
        method: "GET",
        params: { name, active, page, size },
      }),
      providesTags: ["Criteria"],
    }),
    createCriteria: builder.mutation({
      query: (body) => ({
        url: `${API_VERSION}/criteria`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Criteria"],
    }),
    updateCriteria: builder.mutation({
      query: ({ id, body }) => ({
        url: `${API_VERSION}/criteria/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Criteria"],
    }),
    deleteCriteria: builder.mutation({
      query: (id) => ({
        url: `${API_VERSION}/criteria/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Criteria"],
    }),
    toggleCriteriaStatus: builder.mutation({
      query: (id) => ({
        url: `${API_VERSION}/criteria/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Criteria"],
    }),
    getProposedCvs: builder.query({
      query: ({ id, page, size }) => ({
        url: `${API_VERSION}/jobs/${id}/proposed-cv`,
        method: "GET",
        params: { page, size },
      }),
      providesTags: (result, error, { id }) => [{ type: "Jobs", id: `PROPOSED_${id}` }],
    }),
    refreshProposedCvs: builder.mutation({
      query: ({ id, minAiScore, minMatchRate }) => ({
        url: `${API_VERSION}/jobs/${id}/proposed-cv/refresh`,
        method: "POST",
        body: { minAiScore, minMatchRate },
      }),
    }),
    unlockProposedCv: builder.mutation({
      query: (proposedResumeId) => ({
        url: `${API_VERSION}/propose-cv/${proposedResumeId}/unlock`,
        method: "PUT",
      }),
      invalidatesTags: (_, __, proposedResumeId) => [
        { type: "Jobs", id: "LIST" },
        { type: "Jobs", id: `PROPOSED_DETAIL_${proposedResumeId}` },
      ],
    }),
    removeProposedCv: builder.mutation({
      query: ({ proposedResumeId, removeStatus = "REMOVED" }) => ({
        url: `${API_VERSION}/propose-cv/${proposedResumeId}`,
        method: "PUT",
        params: { removeStatus },
      }),
      invalidatesTags: (_, __, { proposedResumeId }) => [
        { type: "Jobs", id: "LIST" },
        { type: "Jobs", id: `PROPOSED_DETAIL_${proposedResumeId}` },
      ],
    }),
    getProposedCvDetail: builder.query({
      query: (proposedResumeId) => ({
        url: `${API_VERSION}/propose-cv/${proposedResumeId}`,
        method: "GET",
      }),
      providesTags: (_, __, proposedResumeId) => [
        { type: "Jobs", id: `PROPOSED_DETAIL_${proposedResumeId}` },
      ],
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
      invalidatesTags: (_, __, body) => (
        body?.jobId != null
          ? [{ type: "Jobs", id: `PROPOSED_${body.jobId}` }]
          : []
      ),
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
    parseJobDescription: builder.mutation({
      query: (body) => ({
        url: `${API_VERSION}/jobs/parse-jd`,
        method: "POST",
        body,
      }),
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
  useGetCriteriaPaginatedQuery,
  useCreateCriteriaMutation,
  useUpdateCriteriaMutation,
  useDeleteCriteriaMutation,
  useToggleCriteriaStatusMutation,
  useGetProposedCvsQuery,
  useRefreshProposedCvsMutation,
  useUnlockProposedCvMutation,
  useRemoveProposedCvMutation,
  useGetProposedCvDetailQuery,
  useGetResumeDetailQuery,
  useInviteCandidateMutation,
  useGetJobQuestionsQuery,
  useCreateJobQuestionMutation,
  useUpdateJobQuestionMutation,
  useDeleteJobQuestionMutation,
  useParseJobDescriptionMutation,
} = jobApi;
