import { api, API_VERSION } from "./baseApi";

export const talentPoolApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTalentPools: builder.query({
            query: () => ({
                url: `${API_VERSION}/talent-pools`,
                method: "GET",
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

        addTalentPoolItem: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/talent-pools/items`,
                method: "POST",
                body: data, // { applicationId, groupId }
            }),
            invalidatesTags: (result, error, { groupId }) => [{ type: "TalentPools", id: `Items-${groupId}` }, "TalentPools"], // Also invalidate general list maybe for counts
        }),

        deleteTalentPoolItem: builder.mutation({
            query: (id) => ({
                url: `${API_VERSION}/talent-pools/items/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TalentPools"], // Hard to know which groupId it belonged to unless passed, so invalidate all to be safe, or we can pass groupId in args
        }),
    }),
});

export const {
    useGetTalentPoolsQuery,
    useGetTalentPoolByIdQuery,
    useGetTalentPoolItemsQuery,
    useCreateTalentPoolMutation,
    useAddTalentPoolItemMutation,
    useDeleteTalentPoolItemMutation,
} = talentPoolApi;
