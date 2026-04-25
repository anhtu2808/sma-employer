import { api, API_VERSION } from "./baseApi";

export const applicationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getApplications: builder.query({
            query: (filter) => ({
                url: `${API_VERSION}/applications`,
                method: "GET",
                params: filter,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.content.map(({ id }) => ({ type: "Applications", id })),
                        { type: "Applications", id: "LIST" },
                    ]
                    : [{ type: "Applications", id: "LIST" }],
        }),

        getApplicationDetail: builder.query({
            query: (id) => `${API_VERSION}/applications/${id}`,
            providesTags: (result, error, id) => [{ type: "Applications", id }],
        }),

        updateApplicationStatus: builder.mutation({
            query: ({ id, status, rejectReason, showToCandidate }) => ({
                url: `${API_VERSION}/applications/${id}/status`,
                method: "PATCH",
                params: {
                    status,
                    rejectReason,
                    showToCandidate
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Applications", id },
                { type: "Applications", id: "LIST" },
            ],
        }),

        getApplicationStatusSummary: builder.query({
            query: () => ({
                url: `${API_VERSION}/applications/status-summary`,
                method: "GET",
            }),
            providesTags: [{ type: "Applications", id: "SUMMARY" }],
        }),

        getShortlistedExport: builder.query({
            query: ({ jobId, type }) => ({
                url: `/v1/applications/export-approved`,
                method: 'GET',
                params: { jobId, type },
            }),
        }),

        downloadResumesZip: builder.query({
            query: (jobId) => ({
                url: `${API_VERSION}/applications/jobs/${jobId}/download-resumes`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            }),
        }),

        retryMatching: builder.mutation({
            query: ({ jobId, resumeId }) => ({
                url: `${API_VERSION}/matching/detail`,
                method: "POST",
                params: { jobId, resumeId },
            }),
            invalidatesTags: [{ type: "Applications", id: "LIST" }],
        }),

        scoreManual: builder.mutation({
            query: ({ evaluationId, manualScore }) => ({
                url: `${API_VERSION}/matching/${evaluationId}/score-manual`,
                method: "PUT",
                body: { manualScore, scoreCriteriaRequests: [] },
            }),
            invalidatesTags: (result, error, { applicationId }) => [
                { type: "Applications", id: "LIST" },
                ...(applicationId ? [{ type: "Applications", id: applicationId }] : []),
            ],
        }),
    }),
});

export const {
    useGetApplicationsQuery,
    useGetApplicationDetailQuery,
    useLazyGetApplicationDetailQuery,
    useGetApplicationStatusSummaryQuery,
    useUpdateApplicationStatusMutation,
    useLazyGetShortlistedExportQuery,
    useLazyDownloadResumesZipQuery,
    useRetryMatchingMutation,
    useScoreManualMutation,
} = applicationApi;
