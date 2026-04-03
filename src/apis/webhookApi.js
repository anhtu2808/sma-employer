import { api, API_VERSION } from "./baseApi";

export const webhookApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getMyWebhooks: builder.query({
            query: () => ({
                url: `${API_VERSION}/webhooks/manage`,
                method: "GET",
            }),
            providesTags: ["Webhooks"],
        }),

        createWebhook: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/webhooks/manage`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Webhooks"],
        }),

        deleteWebhook: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/webhooks/manage/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Webhooks"],
        }),

        regenerateWebhookSecret: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/webhooks/manage/${id}/regenerate-secret`,
                method: "PUT",
            }),
            invalidatesTags: ["Webhooks"],
        }),

        getWebhookLogs: builder.query({
            query: ({ id, page = 0, size = 10 }) => ({
                url: `${API_VERSION}/webhooks/manage/${id}/logs`,
                method: "GET",
                params: { page, size },
            }),
            providesTags: (result, error, { id }) => [{ type: "WebhookLogs", id }],
        }),
    }),
});

export const {
    useGetMyWebhooksQuery,
    useCreateWebhookMutation,
    useDeleteWebhookMutation,
    useRegenerateWebhookSecretMutation,
    useGetWebhookLogsQuery,
} = webhookApi;