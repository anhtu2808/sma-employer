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

        createTalentPool: builder.mutation({
            query: (data) => ({
                url: `${API_VERSION}/talent-pools`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["TalentPools"],
        }),
    }),
});

export const {
    useGetTalentPoolsQuery,
    useCreateTalentPoolMutation,
} = talentPoolApi;
