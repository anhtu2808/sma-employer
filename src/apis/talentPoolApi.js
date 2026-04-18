import { api, API_VERSION } from "./baseApi";

export const talentPoolApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTalentPools: builder.query({
            query: () => ({
                url: `${API_VERSION}/talent-pools`,
                method: "GET",
                params: {
                    sort: 'id,asc'
                }
            }),
            providesTags: ["TalentPools"],
        }),

        getTalentPoolById: builder.query({
            query: (id) => ({
                url: `${API_VERSION}/talent-pools/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "TalentPools", id }],
        }),

        getTalentPoolItems: builder.query({
            query: ({ groupId, page = 0, size = 20, sort }) => ({
                url: `${API_VERSION}/talent-pools/${groupId}/items`,
                method: "GET",
                params: { page, size, sort },
            }),
            providesTags: (result, error, { groupId }) => [{ type: "TalentPools", id: `Items-${groupId}` }],
        }),

        createTalentPool: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/talent-pools`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["TalentPools"],
        }),

        updateTalentPool: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${API_VERSION}/talent-pools/${id}`,
                method: "PUT",
                body: data, // { name, color }
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "TalentPools", id }, "TalentPools"],
        }),

        addTalentPoolItem: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/talent-pools/items`,
                method: "POST",
                body: data, // { applicationId, groupId }
            }),
            invalidatesTags: (result, error, { groupId }) => [{ type: "TalentPools", id: `Items-${groupId}` }, "TalentPools"],
        }),

        addTalentPoolItemProposed: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/talent-pools/items/proposed`,
                method: "POST",
                body: data, // { proposedId, groupId }
            }),
            invalidatesTags: (result, error, { groupId }) => [{ type: "TalentPools", id: `Items-${groupId}` }, "TalentPools"],
        }),

        deleteTalentPool: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/talent-pools/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TalentPools"],
        }),

        deleteTalentPoolItem: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/talent-pools/items/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TalentPools"],
        }),

        moveTalentPoolItem: builder.mutation({
            query: ({ id, groupId }) => ({
                url: `${API_VERSION}/talent-pools/items/${id}`,
                method: "PATCH",
                body: { groupId },
            }),
            invalidatesTags: ["TalentPools"],
        }),
    }),
});

export const {
    useGetTalentPoolsQuery,
    useGetTalentPoolByIdQuery,
    useGetTalentPoolItemsQuery,
    useCreateTalentPoolMutation,
    useUpdateTalentPoolMutation,
    useDeleteTalentPoolMutation,
    useAddTalentPoolItemMutation,
    useAddTalentPoolItemProposedMutation,
    useDeleteTalentPoolItemMutation,
    useMoveTalentPoolItemMutation,
} = talentPoolApi;
