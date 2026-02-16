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
            query: ({ id, status, rejectReason }) => ({
                url: `${API_VERSION}/applications/${id}/status`,
                method: "PATCH",
                params: { status, rejectReason },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Applications", id },
                { type: "Applications", id: "LIST" },
            ],
        }),


    }),
});

export const {
    useGetApplicationsQuery,
    useGetApplicationDetailQuery,
    useUpdateApplicationStatusMutation,
} = applicationApi;