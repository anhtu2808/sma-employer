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
            // Optimistic update: immediately move the card in the cache
            // so the Kanban board doesn't snap back while waiting for API
            async onQueryStarted({ id, status }, { dispatch, queryFulfilled, getState }) {
                // Find the active getApplications cache entry and patch it
                const patchResults = [];
                const state = getState();
                const cacheEntries = state.api?.queries || {};

                for (const key of Object.keys(cacheEntries)) {
                    if (!key.startsWith('getApplications(')) continue;
                    const entry = cacheEntries[key];
                    if (!entry?.data?.data?.content) continue;

                    // Extract the original args from the cache entry
                    const originalArgs = entry.originalArgs;

                    const patchResult = dispatch(
                        applicationApi.util.updateQueryData('getApplications', originalArgs, (draft) => {
                            const app = draft.data.content.find(
                                (a) => String(a.applicationId) === String(id) || String(a.id) === String(id)
                            );
                            if (app) {
                                app.status = status;
                            }
                        })
                    );
                    patchResults.push(patchResult);
                }

                try {
                    await queryFulfilled;
                } catch {
                    // Revert all optimistic patches on failure
                    patchResults.forEach((p) => p.undo());
                }
            },
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
